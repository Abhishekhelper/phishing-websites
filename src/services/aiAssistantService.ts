import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSafetyAdvice(message: string, history: any[]) {
  // Transformation to the new format if needed, but assuming history is already correct
  // The SDK expects history as: { role: 'user' | 'model', parts: [{ text: string }] }[]
  
  const chat = ai.chats.create({ 
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are PhishGuard AI, a specialized assistant for E-banking safety. You provide advice on how to detect phishing, secure online bank accounts, and handle suspicious emails. Be technical but accessible. Focus on associative classification concepts when relevant. Keep responses relatively concise."
    },
    history: history
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}
