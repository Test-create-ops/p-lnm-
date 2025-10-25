
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedBillData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const analyzeBillImage = async (imageFile: File): Promise<ExtractedBillData> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    imagePart,
                    { text: "Analyze this bill image. Extract the provider name, total amount due, due date, and invoice number. If a value is missing, use 'N/A' for strings and 0 for numbers." }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        provider: { type: Type.STRING, description: "The name of the bill provider." },
                        amount: { type: Type.NUMBER, description: "The total amount due." },
                        dueDate: { type: Type.STRING, description: "The due date in YYYY-MM-DD format." },
                        invoiceNumber: { type: Type.STRING, description: "The unique invoice or bill number." }
                    },
                    required: ["provider", "amount", "dueDate", "invoiceNumber"]
                },
            },
        });

        const jsonString = response.text;
        const parsedData = JSON.parse(jsonString);
        return parsedData as ExtractedBillData;

    } catch (error) {
        console.error("Error analyzing bill image:", error);
        throw new Error("Failed to analyze the bill. The image might be unclear or not a valid bill.");
    }
};


export const askComplexQuestion = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error with complex query:", error);
        throw new Error("Failed to get an answer from the AI assistant.");
    }
}
