import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API key is available as an environment variable
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // In a real app, you might want to handle this more gracefully.
    // For this example, we'll throw an error if the key is missing.
    console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getMaintenanceSuggestions = async (problemDescription: string): Promise<string[] | null> => {
    if (!API_KEY) {
        return Promise.resolve(null);
    }
    
    try {
        const prompt = `Un inquilino ha segnalato il seguente problema di manutenzione: "${problemDescription}". Fornisci un elenco in italiano di 3-4 semplici passaggi per la risoluzione dei problemi che un proprietario potrebbe eseguire prima di chiamare un professionista. I passaggi dovrebbero essere sicuri e non richiedere strumenti specializzati. Concentrati sulla diagnosi e su soluzioni semplici.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            description: "Una lista di suggerimenti per la risoluzione dei problemi in italiano.",
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        return result.suggestions || [];
    } catch (error) {
        console.error("Error fetching maintenance suggestions from Gemini API:", error);
        return null;
    }
};