import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiConfig, isAiAvailable } from "./ai";

let geminiClient: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    if (!isAiAvailable()) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    geminiClient = new GoogleGenerativeAI(aiConfig.geminiApiKey!);
  }
  return geminiClient;
}

export { isAiAvailable };
