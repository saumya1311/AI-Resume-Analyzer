import Navbar from "~/components/Navbar";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Footer from "~/components/Footer";

export const meta = () => ([
    { title: 'ApplyWise | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const resume = () => {
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) navigate(`/auth?next=/resume/${id}`);
        };
        checkAuth();
    }, [id, navigate]);

    useEffect(() => {
        const loadResume = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                console.error("Failed to load resume", error);
                return;
            }

            setResumeUrl(data.resumePath);
            setImageUrl(data.imagePath);
            setFeedback(data.feedback);
            console.log({ resumeUrl: data.resumePath, imageUrl: data.imagePath, feedback: data.feedback });
        }

        loadResume();
    }, [id]);

    return (
        <main className="!pt-0 flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-row w-full max-lg:flex-col-reverse flex-grow">
                <section className="feedback-section bg-[#d9ecfe] h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS
                                score={feedback.ATS?.score || 0}
                                suggestions={feedback.ATS?.tips || []}
                            />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
            <Footer />
        </main>
    )
}

export default resume