
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getGeminiPro = () => new GoogleGenAI({ apiKey: API_KEY });

/**
 * Basic Business Advisory using Gemini 3 Flash (Fast)
 */
export async function getFastBusinessAdvice(prompt: string) {
  const ai = getGeminiPro();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text;
}

/**
 * Complex Business Analysis with Thinking Mode
 */
export async function getDeepBusinessAnalysis(prompt: string) {
  const ai = getGeminiPro();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    },
  });
  return response.text;
}

/**
 * Grounded Search for Market Trends
 */
export async function getMarketSearch(query: string) {
  const ai = getGeminiPro();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}

/**
 * Product Image Generation
 */
export async function generateProductImage(prompt: string, aspectRatio: string = "1:1", size: string = "1K") {
  // Requirement: Check if user has selected key for Pro models if needed
  // For this implementation, we assume environment key is valid as per instructions.
  const ai = getGeminiPro();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: size as any
      }
    },
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
