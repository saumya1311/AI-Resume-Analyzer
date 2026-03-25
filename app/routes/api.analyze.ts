import { type ActionFunctionArgs } from "react-router";
import { GoogleGenAI } from "@google/genai";
import { prepareInstructions, AIResponseFormat } from "../../constants";

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        const body = await request.json();
        const { jobTitle, jobDescription, pdfUrl } = body;

        // Note: For a production app you'd extract text from the PDF on the server 
        // using pdf-parse or similar, or pass the PDF to Gemini directly.
        // Google Gen AI SDK supports File API, but it's complex for URLs.
        // For simplicity, we are asking Gemini to act based on context assuming it could read it, 
        // or we'd ideally upload the file to Gemini via File API.
        // In the Puter implementation, it read the file because Puter.fs was used in puter.ai.
        
        // Since we don't have Puter's magic AI PDF reader, we will just simulate it or 
        // if you want real PDF reading, we should download the file and pass to Gemini.

        // Download the file from Supabase Storage
        const pdfResponse = await fetch(pdfUrl);
        const pdfBlob = await pdfResponse.blob();
        const arrayBuffer = await pdfBlob.arrayBuffer();
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { inlineData: { data: Buffer.from(arrayBuffer).toString("base64"), mimeType: "application/pdf" } },
                        { text: prepareInstructions({ jobTitle, jobDescription, AIResponseFormat }) }
                    ]
                }
            ],
            config: {
                responseMimeType: "application/json",
            }
        });

        const feedbackText = response.text;
        if (!feedbackText) throw new Error("No feedback generated.");

        return Response.json({ feedback: JSON.parse(feedbackText) });
    } catch (error: any) {
        console.error("AI Analysis Error details:", error, error?.status, error?.message);
        return Response.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
}
