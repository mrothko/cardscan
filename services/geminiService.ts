import { GoogleGenAI, Type } from "@google/genai";
import { ContactData, SupportedLanguage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-flash-preview for robust multimodal extraction (OCR) + JSON Schema support.
const MODEL_NAME = 'gemini-3-flash-preview';

const getLanguagePrompt = (lang: SupportedLanguage): string => {
  switch (lang) {
    case 'zh-TW':
      return "Focus on Traditional Chinese (繁體中文). Respect traditional character variants.";
    case 'zh-CN':
      return "Focus on Simplified Chinese (简体中文).";
    case 'ja':
      return "Focus on Japanese (日本語). Extract Kanji/Kana names correctly.";
    default:
      return "Focus on English content.";
  }
};

export const analyzeBusinessCard = async (base64Image: string, language: SupportedLanguage): Promise<Partial<ContactData>> => {
  try {
    // 1. Extract MIME type dynamically
    const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    // 2. Remove the Data URL prefix to get raw base64
    const data = base64Image.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
    
    const langInstruction = getLanguagePrompt(language);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: data
            }
          },
          {
            text: `Analyze this business card image. Extract the contact information into a strict JSON format.
            
            Language Context: ${langInstruction}

            Key Requirements:
            1. **Names**: Identify Surname (Last Name) and Given Name (First Name) accurately. 
               - For Chinese/Japanese: Split strictly (e.g., "王大明" -> surname: "王", givenName: "大明").
            2. **Phone Numbers**: 
               - **Mobile/Cell**: Extract ALL mobile numbers found. If there are multiple (e.g. Mobile 1, Mobile 2), list them all in the 'mobilePhones' array.
               - "Tel", "Office", "Work", "Main" -> workPhone
               - "Fax" -> fax
            3. **Other Fields**: Extract Title, Company, Address, Emails, Website.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            surname: { type: Type.STRING, description: "Family name / Last name" },
            givenName: { type: Type.STRING, description: "First name / Given name" },
            title: { type: Type.STRING, description: "Job Title" },
            company: { type: Type.STRING, description: "Company Name" },
            mobilePhones: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of all mobile/cell phone numbers found"
            },
            workPhone: { type: Type.STRING, description: "Work/Office telephone number" },
            fax: { type: Type.STRING, description: "Fax number" },
            emails: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }
            },
            address: { type: Type.STRING, description: "Full physical address" },
            website: { type: Type.STRING }
          },
          required: ["surname", "givenName", "company"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const json = JSON.parse(text);
    return json;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};