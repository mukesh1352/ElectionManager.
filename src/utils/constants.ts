export const ELECTION_STEPS = [
  { id: 1, label: 'Eligibility', icon: '👤' },
  { id: 2, label: 'Registration', icon: '📝' },
  { id: 3, label: 'Deadlines', icon: '⏰' },
  { id: 4, label: 'Documents', icon: '🆔' },
  { id: 5, label: 'Vote!', icon: '🗳️' },
];

export const INITIAL_BOT_MESSAGE = `Hello! I'm **VoteMate**, your intelligent election assistant. 

I use **Google Gemini 1.5 Pro** to help you navigate registration, deadlines, and requirements. 

**Tell me: Are you registered to vote, and what is your location?**`;

export const INITIAL_QUICK_REPLIES = [
  "How do I register?",
  "Am I eligible?",
  "What is the deadline?",
  "I'm a student"
];
