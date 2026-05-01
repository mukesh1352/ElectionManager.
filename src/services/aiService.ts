import { GoogleGenAI } from '@google/genai';
import { ApiResponse, UserContext } from '../types';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  apiVersion: 'v1',
});

const getSystemInstruction = (language: string) => `You are "VoteMate", a premium AI election assistant.
Your core task is to drive the voter journey by detecting intent, extracting entities, and providing high-quality reasoning.

IMPORTANT: Always respond with a valid JSON object matching the requested schema.
LANGUAGE: Respond entirely in ${language}.

CORE COMPETENCIES:
1. **NLP Intent Detection**: Categorize user messages (eligibility_check, registration_help, deadline_lookup, etc.)
2. **Entity Extraction**: Identify 'age', 'location', and 'registrationStatus'.
3. **Complex Reasoning**: Explain *why* certain rules apply (e.g., student voting, felony disenfranchisement, ID laws).
4. **Actionable Timeline**: Provide specific dates/deadlines for the user's location.

TONE: Professional, encouraging, and authoritative but simple.
`;

const responseSchema = {
  type: 'object',
  properties: {
    response: { type: 'string', description: "Markdown-formatted explanation." },
    intent: { type: 'string' },
    userContext: {
      type: 'object',
      properties: {
        age: { type: 'number', nullable: true },
        location: { type: 'string', nullable: true },
        isRegistered: { type: 'boolean', nullable: true }
      }
    },
    currentStepId: { type: 'number' },
    suggestedReplies: { type: 'array', items: { type: 'string' } },
    timelineHighlights: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          event: { type: 'string' }
        }
      }
    }
  },
  required: ["response", "currentStepId", "suggestedReplies"],
};

export class AIService {
  static async processMessage(
    message: string,
    history: any[],
    context: UserContext,
    language: string
  ): Promise<ApiResponse> {
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const contextNote = `\n[Context: Age=${context.age}, Loc=${context.location}, Reg=${context.isRegistered}]\n`;
    contents.push({ role: 'user', parts: [{ text: contextNote + message }] });

    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents,
      config: {
        systemInstruction: getSystemInstruction(language),
        temperature: 0.2, // Lower temperature for more consistent JSON/logic
        responseMimeType: "application/json",
        responseSchema,
      }
    });

    if (!result || !result.text) {
      throw new Error("Failed to get response from Gemini");
    }

    return JSON.parse(result.text) as ApiResponse;
  }
}
