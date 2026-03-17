import { type FormEvent, useState, useEffect } from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import Footer from "~/components/Footer";

import { supabase } from "~/lib/supabase";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) navigate('/auth?next=/upload');
        };
        checkAuth();
    }, [navigate]);
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);

        const uuid = generateUUID();

        setStatusText('Uploading the file...');
        const { data: uploadFile, error: fileError } = await supabase.storage
            .from('resumes')
            .upload(`${uuid}/${file.name}`, file, { cacheControl: '3600', upsert: false });

        if (fileError) return setStatusText(`Error: Failed to upload file - ${fileError.message}`);

        const { data: { publicUrl: pdfUrl } } = supabase.storage.from('resumes').getPublicUrl(`${uuid}/${file.name}`);

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) {
            console.error(imageFile.error);
            return setStatusText(imageFile.error ?? "PDF conversion failed");
        }

        setStatusText('Uploading the image...');
        const { data: uploadImage, error: imgError } = await supabase.storage
            .from('resumes')
            .upload(`${uuid}/${imageFile.file.name}`, imageFile.file, { cacheControl: '3600', upsert: false });

        if (imgError) return setStatusText(`Error: Failed to upload image - ${imgError.message}`);

        const { data: { publicUrl: imageUrl } } = supabase.storage.from('resumes').getPublicUrl(`${uuid}/${imageFile.file.name}`);

        setStatusText('Analyzing with AI...');

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobTitle, jobDescription, pdfUrl })
            });

            if (!res.ok) throw new Error('Failed to analyze resume');
            const result = await res.json();

            if (result.error) throw new Error(result.error);

            setStatusText('Saving data...');
            const { data: { session } } = await supabase.auth.getSession();
            const data = {
                id: uuid,
                user_id: session?.user.id,
                resumePath: pdfUrl,
                imagePath: imageUrl,
                companyName,
                jobTitle,
                jobDescription,
                feedback: result.feedback,
            }

            const { error: dbError } = await supabase.from('resumes').insert(data);
            if (dbError) throw dbError;

            setStatusText('Analysis complete, redirecting...');
            navigate(`/resume/${uuid}`);
        } catch (error: any) {
            console.error(error);
            setStatusText(`Error: ${error.message}`);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.png')] bg-cover min-h-screen flex flex-col">
            <Navbar />

            <section className="main-section flex-grow">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
            <Footer />
        </main>
    )
}
export default Upload
