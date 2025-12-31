import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Injected by the environment
const ai = new GoogleGenAI({ apiKey });

export const generateCoachTip = async (topic: string): Promise<string> => {
  if (!apiKey) return "Please configure your API Key to use the AI Coach.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert kids' balance bike coach in India. Give a short, encouraging, and practical tip about "${topic}" for parents. Keep it under 50 words. Tone: Fun, supportive, energetic.`,
    });
    return response.text || "Keep riding and having fun!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Remember, the most important thing is to have fun!";
  }
};

export const generateEventImage = async (prompt: string): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    // Extract image from response
    // Note: The specific output format for image generation in this library version
    // often returns base64 in inlineData if using the 'generateContent' with image model,
    // OR creates a separate response structure.
    // Based on the instruction, we iterate parts.
    
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};