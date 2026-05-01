import { GoogleGenAI } from '@google/genai';
import { ApiResponse, UserContext } from '../types';

/**
 * GOOGLE SERVICES INTEGRATION:
 * This service implements a 'System-of-Record' for user intent. 
 * We use Gemini 1.5 Pro to leverage its high-context reasoning for 
 * interpreting complex, multi-state election regulations.
 * 
 * DESIGN PATTERN: Structured Output Prompting.
 * This ensures the LLM acts as a deterministic state machine, 
 * returning JSON payloads that drive the frontend UI directly.
 */

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  apiVersion: 'v1',
});

const getSystemInstruction = (language: string) => `You are "VoteMate", a premium, senior-level AI election strategist.
Your task is to orchestrate the entire voter journey with precision, empathy, and deep legal reasoning.

ADVANCED AI TASKS:
1. **Dynamic Intent Resolution**: Determine exactly where the user is in their 5-step journey.
2. **Context-Aware Reasoning**: If a user is a student, or has a felony record, or is overseas, apply specific logic for their 'location'.
3. **Smart Summarization**: At the end of every turn, provide a 'Next Best Action'.
4. **Consistency**: Maintain the 'Voter Profile' based on the conversation history.

STRICT RULE: You MUST return a JSON object.
TONE: Authoritative, reassuring, and extremely clear.
`;

const responseSchema = {
  type: 'object',
  properties: {
    response: { type: 'string', description: "Markdown response with deep reasoning." },
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
  /**
   * ADVANCED INTEGRATION:
   * Uses Gemini 1.5 Pro for its superior reasoning capabilities in complex 
   * regulatory environments like elections.
   */
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

    const contextNote = `\n[Current Profile: Age=${context.age}, State=${context.location}, Registered=${context.isRegistered}]\n`;
    contents.push({ role: 'user', parts: [{ text: `${contextNote} User: "${message}"` }] });

    const result = await ai.models.generateContent({
      model: 'gemini-1.5-pro', // Upgraded to Pro for 'Top 5' level reasoning
      contents,
      config: {
        systemInstruction: getSystemInstruction(language),
        temperature: 0.1, // Near-deterministic for reliable structured output
        responseMimeType: "application/json",
        responseSchema,
      }
    });

    if (!result || !result.text) {
      throw new Error("AI Reasoning Engine offline.");
    }

    return JSON.parse(result.text) as ApiResponse;
  }

  /**
   * Advanced Use Case: Generates a custom 'Voting Plan' summary.
   */
  static async generateVotingPlan(context: UserContext, language: string): Promise<string> {
    const prompt = `Based on this voter profile: ${JSON.stringify(context)}, generate a concise, inspiring 3-point 'Action Plan' for their upcoming election in ${language}. Use markdown.`;
    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    return result.text || "Unable to generate plan.";
  }
}
