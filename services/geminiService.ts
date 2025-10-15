
import { GoogleGenAI } from "@google/genai";

export async function generateDescription(
  productName: string,
  category: string
): Promise<string> {
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Returning placeholder description.");
    return `Descrição gerada por IA para ${productName}: Um produto incrível na categoria ${category}, perfeito para quem busca qualidade e inovação. Ideal para uso diário e uma excelente opção de presente.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere uma descrição de produto curta e persuasiva (máximo de 200 caracteres) para uma rifa. O produto é "${productName}" na categoria "${category}". Destaque os pontos positivos de forma atrativa para compradores. Não use hashtags.`,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return "Não foi possível gerar a descrição. Por favor, tente novamente ou escreva manualmente.";
  }
}
