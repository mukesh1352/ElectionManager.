import { UserContext, ApiResponse } from '../types';

/**
 * Handles rule-based shortcuts for common election logic.
 * This improves efficiency by avoiding AI calls for simple, static checks.
 */
export class VoterRuleService {
  static checkBasicEligibility(context: UserContext, language: string): ApiResponse | null {
    // Rule: If age is explicitly set and < 18, provide immediate feedback
    if (context.age !== null && context.age < 18) {
      return {
        response: language === 'Spanish' 
          ? "Parece que tienes menos de 18 años. En la mayoría de los estados, puedes **pre-registrarte** si tienes 16 o 17 años para poder votar automáticamente al cumplir 18."
          : "It looks like you are under 18. In most states, you can **pre-register** at 16 or 17 so you're automatically ready to vote when you turn 18!",
        intent: 'eligibility_check',
        userContext: context,
        currentStepId: 1,
        suggestedReplies: language === 'Spanish' 
          ? ["¿Cómo me pre-registro?", "¿Cuáles son las reglas de mi estado?"]
          : ["How do I pre-register?", "What are my state's rules?"],
      };
    }

    // Rule: If no location is provided, we can't give specific info
    if (!context.location && context.age !== null && context.age >= 18) {
       // We don't return a full response here because we want Gemini to ask nicely,
       // but we could add more rules here for efficiency.
    }

    return null;
  }
}
