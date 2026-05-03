import { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { message, history } = JSON.parse(event.body || "{}");

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are PhishGuard AI, a specialized assistant for E-banking safety. You provide advice on how to detect phishing, secure online bank accounts, and handle suspicious emails. Be technical but accessible. Focus on associative classification concepts when relevant. Keep responses relatively concise."
    });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(message);

    return {
      statusCode: 200,
      body: JSON.stringify({ text: result.response.text() }),
    };
  } catch (error) {
    console.error("Assistant failure:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Assistant analysis failed" }),
    };
  }
};
