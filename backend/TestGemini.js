
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: 'Return only JSON: {"status":"working"}',
    });

    console.log("Gemini Response:", response.text);
  } catch (error) {
    console.log("Gemini Error:", error.status, error.message);
  }
}

testGemini();
