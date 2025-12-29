
import { GoogleGenAI, Type } from "@google/genai";
import { PerfumeRecommendation } from "./types";

const SYSTEM_PROMPT = `You are a world-class Persian Perfume Sommelier and Visual Data Expert.

Your Task:
1. Analyze the user's request. 
2. If the user provides a specific perfume name, suggest 3 SIMILAR but DISTINCT perfumes. NEVER include the perfume name the user mentioned in your suggestions.
3. If the user describes a mood/memory, suggest 3 perfumes that capture that essence.

For each of the 3 recommendations, you MUST:
- name: Full English name of the perfume.
- brand: Full English brand name.
- scentProfile: 3-4 key notes in Persian (e.g., یاس، چوب صندل، وانیل).
- story: A poetic Persian paragraph explaining why this matches. Use **bold** for notes.
- imageUrl: MANDATORY. Use the googleSearch tool to find the exact main product image for this perfume. Search for "site:fragrantica.com [Brand] [Name] perfume bottle". Extract a direct URL (usually from fimgs.net or fragrantica.com). It MUST be a direct link to the image file.

Strict Rule: Return ONLY a JSON array containing exactly 3 objects. Do not add any text before or after the JSON.`;

export async function getPerfumeRecommendations(prompt: string): Promise<PerfumeRecommendation[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              brand: { type: Type.STRING },
              scentProfile: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              story: { type: Type.STRING },
              imageUrl: { 
                type: Type.STRING, 
                description: "Direct URL of the perfume bottle image found via search (prioritize Fragrantica/fimgs.net)." 
              }
            },
            required: ["name", "brand", "scentProfile", "story", "imageUrl"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("پاسخی از هوش مصنوعی دریافت نشد.");
    }

    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("مشکلی در یافتن دقیق عطرها یا تصاویر آن‌ها پیش آمد. لطفاً دوباره امتحان کنید.");
  }
}
