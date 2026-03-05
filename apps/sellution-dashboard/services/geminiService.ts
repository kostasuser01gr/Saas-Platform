import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: In a real environment, ensure process.env.API_KEY is set.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const sendMessageToGemini = async (history: { role: 'user' | 'model'; parts: { text: string }[] }[], newMessage: string) => {
  if (!apiKey) {
    // Return a mock response if no API key is present for demo purposes
    return "I'm your AI Sales Assistant. To fully activate me, please ensure a valid Gemini API Key is configured in the environment variables. For now, I can tell you that your sales are trending positively!";
  }

  try {
    const model = 'gemini-2.5-flash-latest'; // Using a fast model for chat
    const chat = ai.chats.create({
      model: model,
      history: history,
      config: {
        systemInstruction: "You are a helpful, professional, and data-driven Sales Assistant AI named 'Sellution AI'. Your goal is to help the user analyze their sales data, suggest improvements, and draft emails to clients. Keep responses concise and business-focused.",
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the sales database right now. Please try again later.";
  }
};