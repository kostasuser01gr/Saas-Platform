import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
// Note: In a real production app, you might want to proxy this through a backend
// to avoid exposing the key if it wasn't handled by the specific AI Studio environment.
// Here, process.env.GEMINI_API_KEY is injected securely.

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const MODELS = {
  "gemini-3.1-pro-preview": "Gemini 3.1 Pro (Smart)",
  "gemini-2.5-flash-latest": "Gemini 2.5 Flash (Fast)",
};

export const DEFAULT_MODEL = "gemini-3.1-pro-preview";
