
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly as per guidelines.
export const getSmartTags = async (text: string) => {
  if (!process.env.API_KEY || !text) return [];

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 2-3 short, relevant tags for this financial note: "${text}". Keep tags in Chinese, no symbols.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
    });

    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr) as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const suggestLocations = async (lat: number, lng: number, note: string) => {
  if (!process.env.API_KEY) return [];

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on my current location and this note "${note}", suggest 3 likely business names nearby. 
                 Return ONLY the names as a comma-separated list in Chinese.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
        // responseMimeType and responseSchema are NOT allowed when using the googleMaps tool.
      },
    });

    // Extract text directly from response property. The output is not guaranteed to be JSON when using grounding.
    const text = response.text || "";
    if (!text) return ["正在定位...", "附近商户"];
    
    // Split by common separators if the model returns a list.
    return text.split(/[，, \n]+/).filter(s => s.trim().length > 0).slice(0, 3);
  } catch (error) {
    console.error("Location Suggestion Error:", error);
    // Fallback if maps grounding fails or returns empty.
    return ["正在定位...", "附近商户"];
  }
};
