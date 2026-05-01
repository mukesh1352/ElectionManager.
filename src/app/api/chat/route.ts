import { AIService } from '@/services/aiService';
import { VoterRuleService } from '@/services/voterService';
import { responseCache } from '@/utils/cache';

export async function POST(req: Request) {
  try {
    const { history, message, language = 'English', currentUserContext } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid message" }), { status: 400 });
    }

    // 1. Efficiency: Check Cache
    const cachedResponse = responseCache.get(message, currentUserContext, language);
    if (cachedResponse) {
      return new Response(JSON.stringify(cachedResponse), { status: 200 });
    }

    // 2. Efficiency: Check Rule-Based Shortcuts
    const ruleResponse = VoterRuleService.checkBasicEligibility(currentUserContext, language);
    if (ruleResponse && message.toLowerCase().includes('eligib')) {
      return new Response(JSON.stringify(ruleResponse), { status: 200 });
    }

    // 3. Google Services: Deep Gemini Integration
    const aiResponse = await AIService.processMessage(
      message,
      history,
      currentUserContext,
      language
    );

    // 4. Update Cache
    responseCache.set(message, currentUserContext, language, aiResponse);

    return new Response(JSON.stringify(aiResponse), { status: 200 });

  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
