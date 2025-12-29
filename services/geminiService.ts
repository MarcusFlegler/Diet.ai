import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserPreferences, IngredientInput } from "../types";

// Initialize the client
// Note: We use process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert Blob/File to Base64
const fileToBase64 = (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          calories: { type: Type.NUMBER },
          timeToCook: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["name", "description", "ingredients", "instructions", "timeToCook"],
      },
    },
  },
};

export const generateRecipes = async (
  input: IngredientInput,
  prefs: UserPreferences
) => {
  const parts: any[] = [];

  // 1. Add Image Part if exists
  if (input.image) {
    const base64Image = await fileToBase64(input.image);
    parts.push({
      inlineData: {
        mimeType: input.image.type,
        data: base64Image,
      },
    });
  }

  // 2. Add Audio Part if exists
  if (input.audioBlob) {
    const base64Audio = await fileToBase64(input.audioBlob);
    parts.push({
      inlineData: {
        mimeType: input.audioBlob.type, // usually 'audio/webm' or 'audio/mp4' from browser
        data: base64Audio,
      },
    });
  }

  // 3. Construct the prompt
  let prompt = `Você é um chef e nutricionista de classe mundial. Analise as entradas fornecidas (texto, imagem e/ou áudio) para identificar os ingredientes disponíveis.
  Gere 3 receitas distintas. TODAS as saídas devem estar em PORTUGUÊS DO BRASIL.`;
  
  if (input.text) {
    prompt += `\n\nInformações adicionais em texto: ${input.text}`;
  }
  
  if (input.image) {
    prompt += `\n\nAnalise visualmente a imagem para encontrar mais ingredientes.`;
  }

  if (input.audioBlob) {
    prompt += `\n\nOuça o áudio para identificar ingredientes ou preferências faladas pelo usuário.`;
  }

  prompt += `\n\nPreferências do Usuário:
  - Nível de Fome: ${prefs.hungerLevel}/3
  - Objetivo: ${prefs.objective}
  - Textura: ${prefs.texture}
  
  Adapte as receitas a estas preferências.
  Retorne o resultado estritamente como JSON.`;

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: {
        parts: parts,
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        systemInstruction: "Você é o Dietai, um assistente de culinária multimodal.",
        temperature: 0.4, 
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return parsed.recipes || [];
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};