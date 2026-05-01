/** Shared TypeScript types across VoteMate frontend */

export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  content: string;
}

export interface UserContext {
  age: number | null;
  location: string | null;
  isRegistered: boolean | null;
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface ElectionStep {
  id: number;
  label: string;
}

export interface ApiResponse {
  response: string;
  intent?: string;
  userContext?: Partial<UserContext>;
  currentStepId?: number;
  suggestedReplies?: string[];
  timelineHighlights?: TimelineEvent[];
  error?: string;
}

export const ELECTION_STEPS: ElectionStep[] = [
  { id: 1, label: 'Eligibility' },
  { id: 2, label: 'Registration' },
  { id: 3, label: 'Deadlines' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Voting' },
];

export const INITIAL_QUICK_REPLIES = [
  "I'm 18, from California.",
  "I'm 20, studying in New York but from Texas.",
  "I'm not sure if I'm registered.",
  "I don't have a photo ID.",
];

export const INITIAL_BOT_MESSAGE =
  "Hi there! I'm VoteMate, your highly intelligent AI election assistant. I'm here to guide you. Could you please tell me your location (State/Country) and your age?";
