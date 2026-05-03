import { Handler } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { url, basicFeatures, prompt, systemInstruction } = JSON.parse(event.body || "{}");

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    return {
      statusCode: 200,
      body: result.response.text(),
    };
  } catch (error) {
    console.error("Classification failure:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI analysis failed" }),
    };
  }
};
