
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

/**
 * Standard text tasks (summaries, fast Q&A)
 */
export async function getFastBusinessAdvice(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text ?? "I'm sorry, I couldn't generate a response at this time.";
}

/**
 * Deep strategic analysis with Thinking Budget
 */
export async function getDeepBusinessAnalysis(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    },
  });
  return response.text ?? "Strategic analysis failed to generate. Please try again.";
}

/**
 * Real-time Market Search
 */
export async function getMarketSearch(query: string): Promise<{ text: string; sources: any[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return {
    text: response.text ?? "No search results found.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}

/**
 * Professional Image Generation (Gemini 3 Pro)
 * Follows mandatory key selection flow
 */
export async function generateProductImage(
  prompt: string, 
  aspectRatio: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9" = "1:1", 
  size: "1K" | "2K" | "4K" = "1K"
): Promise<string | null> {
  // 1. Mandatory API key selection check
  const win = window as any;
  if (win.aistudio) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await win.aistudio.openSelectKey();
      // Proceed immediately as per race condition rules
    }
  }

  // 2. New instance right before the call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: size
        }
      },
    });
    
    // Find image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      if (win.aistudio) await win.aistudio.openSelectKey();
    }
    throw error;
  }
  return null;
}
