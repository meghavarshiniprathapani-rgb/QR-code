
import { GoogleGenAI, Type } from "@google/genai";

export async function getSafetyTip(score: number, locationName: string, tags: string[] = []): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const tagsContext = tags.length > 0 ? `The user noticed: ${tags.join(', ')}.` : "";
  
  const prompt = `
    A user is reporting safety at "${locationName}". 
    Rating: ${score}/5.
    ${tagsContext}
    
    As an official safety assistant, provide a one-sentence advisory (under 15 words).
    - If 4-5 stars: Acknowledge the safe environment and remind them to stay aware.
    - If 1-3 stars: Provide a specific, helpful safety tip related to their tags or general safety.
    Tone: Professional, calm, and supportive.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 60,
      }
    });

    return response.text?.trim() || "Thank you for your report. Your vigilance helps keep the community safe.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Your response has been logged anonymously. Thank you for your contribution.";
  }
}
