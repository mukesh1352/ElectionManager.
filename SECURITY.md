# 🔒 Security Policy

VoteMate is built with a "Security First" mindset, focusing on protecting user data and ensuring safe AI interactions.

## API Key Management
- All API keys (including `GEMINI_API_KEY`) are stored in server-side environment variables (`.env.local`).
- These keys are **never** exposed to the client-side code.
- We use Next.js API routes as a secure proxy to communicate with Google services.

## AI Safety & Prompt Injection
- **Structured Outputs**: We use Gemini's structured JSON output mode. This prevents the model from generating arbitrary or malicious scripts, as it must adhere to a strict schema.
- **Input Sanitization**: User messages are wrapped and treated as "data" within the system instructions to mitigate prompt injection attempts.
- **Persona Enforcement**: The system instructions explicitly forbid the AI from dropping its persona or executing external commands.

## Input Validation
- **Type Checking**: All API requests are validated for correct data types (JSON).
- **Length Limits**: User messages are restricted to 1000 characters to prevent buffer overflow or DoS attacks on the LLM processing.
- **Rate Limiting**: Our infrastructure (e.g., Vercel) provides basic rate limiting to prevent automated abuse.

## Data Privacy
- VoteMate is designed to be **ephemeral**. We do not persist user data in a database.
- Sessions are maintained in local state and are cleared on page refresh.
