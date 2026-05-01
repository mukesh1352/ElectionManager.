import { describe, it, expect } from 'vitest';
import { VoterRuleService } from '../services/voterService';
import { UserContext } from '../types';

describe('Voter Decision Flows & Eligibility', () => {
  it('correctly identifies underage voters and provides pre-registration advice', () => {
    const context: UserContext = { age: 17, location: 'California', isRegistered: false };
    const response = VoterRuleService.checkBasicEligibility(context, 'English');
    
    expect(response).not.toBeNull();
    expect(response?.response).toContain('pre-register');
    expect(response?.currentStepId).toBe(1);
  });

  it('handles adult voters with no location by deferring to AI reasoning', () => {
    const context: UserContext = { age: 25, location: null, isRegistered: false };
    const response = VoterRuleService.checkBasicEligibility(context, 'English');
    
    // Should be null because VoterRuleService only handles simple deterministic rules (like <18)
    // Complex cases should fall through to Gemini for reasoning.
    expect(response).toBeNull();
  });

  it('provides Spanish advice for underage voters', () => {
    const context: UserContext = { age: 16, location: 'Texas', isRegistered: false };
    const response = VoterRuleService.checkBasicEligibility(context, 'Spanish');
    
    expect(response?.response).toContain('pre-registrarte');
  });
});
