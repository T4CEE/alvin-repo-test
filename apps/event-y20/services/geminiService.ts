import { GoogleGenAI } from "@google/genai";
import { FormData } from "../types";

// Assume process.env.API_KEY is configured in the environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY not found. Chatbot will not work.");
}

// Fix: Initialize only if API_KEY is available to prevent a crash.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const getBotResponse = async (prompt: string): Promise<string> => {
  // Fix: Check if the 'ai' instance was successfully initialized.
  if (!ai) {
    return "I'm sorry, my connection to the server is not configured. The API key is missing.";
  }
  
  try {
    // Fix: Use systemInstruction for setting the bot's persona and context, which is a better practice than including it in the user's prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful assistant for the Y20 delegation attending the G20 Social Summit. Answer questions related to the conference, registration, and logistics. Keep your answers concise and helpful.",
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    return "I'm sorry, I encountered an error while trying to respond. Please try again later.";
  }
};

export const submitRegistration = async (formData: Partial<FormData>): Promise<void> => {
  const webhookUrl = 'https://n8n.alvin.finance/webhook/send-email-Y20';
  const dataToSend = { ...formData, eventName: 'Y20' };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    console.log('Registration submission response status:', response.status);

    if (!response.ok) {
      throw new Error('Failed to submit registration');
    }
  } catch (error) {
    console.error('Error submitting registration:', error);
    throw error;
  }
};
