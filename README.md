<p align="center">
  <h1 align="center">🗳️ VoteMate</h1>
  <p align="center"><strong>Your AI-Powered Election Companion</strong></p>
  <p align="center">
    An intelligent voting assistant that uses NLP and Google Gemini to guide users step-by-step through eligibility, registration, deadlines, documents, and voting.
  </p>
</p>

---

## 🏗️ Chosen Vertical
**Civic Engagement & Voter Assistance**
VoteMate is designed to bridge the information gap in the democratic process, specifically targeting first-time and underrepresented voters through an intelligent, personalized guidance system.

---

## 🎯 Problem Statement

Millions of eligible voters — especially first-time voters, out-of-state students, and marginalized communities — find the election process **confusing, fragmented, and intimidating**. Information about registration deadlines, required documents, and absentee voting is scattered across dozens of government websites with dense legal language.

**VoteMate solves this** by providing a single, intelligent assistant that understands natural language, remembers your context, and walks you through the entire process in plain language.

---

## 💡 What Makes VoteMate Unique

| Feature | Traditional Tools | VoteMate |
|---------|------------------|----------|
| **Understanding** | Keyword search | NLP intent detection via Gemini |
| **Personalization** | One-size-fits-all FAQ | Extracts age, location, status from conversation |
| **Guidance** | Static pages | Dynamic 5-step progress tracker |
| **Edge Cases** | Not addressed | Students, missing IDs, homelessness |
| **Accessibility** | Text only | Voice input/output + multi-language |
| **Engagement** | Boring forms | Confetti celebrations + demo mode |

---

## ✨ Google Services (Gemini) - Deep Integration

VoteMate is not just a chat app; it is a **Gemini-driven state machine**. We have deeply integrated Google Gemini 1.5 Flash to handle:

-   **Intelligent NLP Intent Detection**: Every message is analyzed by Gemini to detect the user's intent (Eligibility Check, Registration Help, Deadline Lookup, etc.) to drive the UI journey.
-   **Automated Entity Extraction**: Gemini acts as a live data parser, identifying and extracting `age`, `location`, and `voterStatus` from natural conversation to build the **Voter Profile**.
-   **Contextual Reasoning**: Gemini explains the *why* behind complex election laws (e.g., student voting, out-of-state ballots, ID requirements) in plain, personalized language.
-   **Structured State Control**: The assistant doesn't just return text; it returns **Structured JSON** that directly controls the 5-step progress tracker and populates the dynamic timeline widget.
-   **Service-Layer Integration**: AI logic is fully decoupled into a dedicated `aiService`, ensuring clean architecture and modularity.

---

## ⚡ Efficiency & Architecture

-   **High-Speed Caching**: Implemented a service-level cache in `utils/cache.ts` to provide instant responses for repeated queries and reduce API latency.
-   **Hybrid Reasoning Engine**: Uses a **VoterRuleService** for immediate, rule-based feedback on simple criteria (like age checks), falling back to Gemini for complex conversational reasoning.
-   **Modular Folder Structure**: Completely refactored into a clean, professional architecture:
    - `/services`: Centralized AI and Business logic
    - `/utils`: Shared helper functions and caching
    - `/components`: Decoupled, reusable UI components
    - `/app/api`: Clean, thin route handlers

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS Modules (custom design system) |
| **AI/NLP** | Google Gemini (`@google/genai`) with Structured Outputs |
| **Voice** | Web Speech API (native browser) |
| **Testing** | Vitest + React Testing Library |
| **Package Manager** | Bun |
| **Extras** | `canvas-confetti`, `react-markdown` |

---

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Client (React)                    │
│                                                     │
│  ┌───────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Chat UI   │  │ Progress │  │ Voter Profile    │ │
│  │ + Voice   │  │ Tracker  │  │ + Timeline       │ │
│  └─────┬─────┘  └────┬─────┘  └───────┬──────────┘ │
│        │              │                │             │
│        └──────────────┴────────────────┘             │
│                       │                              │
│              JSON Request/Response                   │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────┐
│              API Route (Next.js Server)              │
│                                                      │
│  ┌─────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │ Input       │  │ Context    │  │ Structured   │  │
│  │ Validation  │  │ Injection  │  │ JSON Schema  │  │
│  └──────┬──────┘  └─────┬──────┘  └──────┬───────┘  │
│         └───────────────┴────────────────┘           │
│                         │                            │
└─────────────────────────┬────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────┐
│               Google Gemini API                       │
│                                                       │
│  System Prompt → NLP + Entity Extraction →            │
│  Structured JSON { response, intent, userContext,     │
│                    currentStepId, suggestedReplies,    │
│                    timelineHighlights }                │
└───────────────────────────────────────────────────────┘
```

---

## 🚀 How It Works — User Journey
1. **User opens VoteMate** → Greeted with a friendly welcome message
2. **Shares basic info** → "I'm 18, from Texas" → AI extracts entities → Voter Profile populates
3. **Eligibility check** → Progress tracker advances → AI confirms eligibility
4. **Registration guidance** → Step-by-step instructions for their specific state
5. **Deadline awareness** → Timeline widget shows key dates
6. **Document checklist** → Exactly which IDs they need
7. **Voting day** → Confetti! 🎉 Journey complete

---

## 🎬 Demo Flow (For Judges)

> **Click "Run Demo Journey"** — it auto-plays a complete voter journey with zero manual input.

The demo simulates an 18-year-old college student from Texas studying in New York who needs to vote via absentee ballot. Watch the:
- **Voter Profile** auto-fill with extracted entities
- **Progress Tracker** advance through all 5 steps
- **Timeline** populate with registration deadlines
- **Confetti** burst on completion

---

## 🔑 Google Services Usage

VoteMate uses the **Google Gemini API** (`gemini-2.5-flash`) as its core intelligence engine:

| Capability | How Gemini Is Used |
|------------|-------------------|
| **NLP Understanding** | Interprets vague queries ("Can I vote?") into structured intents |
| **Entity Extraction** | Pulls age, location, and voter status from natural conversation |
| **Response Generation** | Creates beginner-friendly explanations of complex election laws |
| **Decision Making** | Determines which step the user is on (1-5) and generates contextual quick replies |
| **Timeline Intelligence** | Identifies and structures relevant deadlines |
| **Multi-language** | Translates all outputs to the user's selected language |

**Key Technical Detail**: We use Gemini's **Structured Output** feature with a strict JSON schema. This transforms the LLM from a text generator into a deterministic NLP engine that directly drives UI state.

---

## 🔒 Security

See [SECURITY.md](SECURITY.md) for full details.

- ✅ API keys in `.env.local` (server-only, gitignored)
- ✅ Input validation (type + length checks)
- ✅ Prompt injection defense in system instructions
- ✅ Sliding window limits token exposure
- ✅ Structured output prevents arbitrary content

---

## 🧪 Testing

```bash
bun run test
```

**12 test cases** covering:
- VoterProfile rendering with different entity states
- ProgressTracker step completion logic (including SVG icons)
- Timeline rendering and placeholder states
- API input validation (empty, wrong type, too long, valid)

---

## ♿ Accessibility

- `aria-label` on every interactive element
- `aria-live="polite"` on the chat log for screen readers
- `aria-hidden="true"` on all decorative SVGs
- `role="log"`, `role="group"`, `role="progressbar"` semantic roles
- `maxLength` on input to match server-side validation
- Voice input/output for users who cannot type or read easily
- High-contrast dark theme with carefully chosen color ratios

---

## 📦 Setup Instructions

### Prerequisites
- [Bun](https://bun.sh/) (v1.0+)
- A Google Gemini API key ([get one here](https://aistudio.google.com/apikey))

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/mukesh1352/ElectionManager..git
cd ElectionManager.

# 2. Install dependencies
bun install

# 3. Configure your API key
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# 4. Run the development server
bun run dev

# 5. Open http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run test` | Run test suite |
| `bun run lint` | Run ESLint |

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)
The easiest way to deploy VoteMate is using [Vercel](https://vercel.com/):
1. Push your code to GitHub.
2. Import your repository into Vercel.
3. Add the `GEMINI_API_KEY` to **Project Settings > Environment Variables**.
4. Click **Deploy**.

### Option 2: Docker
For self-hosting or containerized environments:
```bash
# 1. Build the image
docker build -t votemate .

# 2. Run the container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key_here votemate
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts    # Backend: Gemini API + NLP engine
│   ├── globals.css           # Design system tokens
│   ├── layout.tsx            # SEO metadata + font loading
│   ├── page.module.css       # Component styles
│   └── page.tsx              # Main application (state orchestrator)
├── components/
│   ├── ProgressTracker.tsx   # 5-step visual progress
│   ├── Timeline.tsx          # Dynamic deadline timeline
│   └── VoterProfile.tsx      # Entity extraction display
├── types/
│   └── index.ts              # Shared TypeScript types & constants
└── __tests__/
    ├── setup.ts              # Vitest configuration
    └── decisionLogic.test.tsx # 12 unit tests
```

---

## 🔮 Future Improvements

- **Voter registration API integration** for real-time status checks
- **Push notification reminders** for upcoming deadlines
- **Polling place finder** with map integration
- **Offline mode** with cached election data
- **Additional languages** (Hindi, Mandarin, Arabic)

---

## 📝 Assumptions
1. **API Availability**: Assumes the Google Gemini API is accessible and has sufficient quota.
2. **Web Speech API Support**: Assumes the user is using a modern browser (like Chrome or Edge) that supports the Web Speech API for voice features.
3. **Registration Data**: The AI provides general guidance based on its training data; in a production environment, this would be connected to a live government API for real-time verification.
4. **Internet Connectivity**: Assumes a stable connection for AI processing and voice recognition services.
