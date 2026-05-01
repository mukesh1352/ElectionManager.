# VoteMate 🗳️

An intelligent, AI-powered election assistant designed to guide users through the complex voting process with ease. Built for hackathons, VoteMate transforms the traditional "government FAQ" experience into a highly personalized, interactive, and intelligent journey.

![VoteMate Interface Overview](design.md) <!-- Placeholder for actual screenshot -->

## 🌟 Key Features

### 1. Natural Language Processing (NLP) & Entity Extraction
VoteMate isn't just a chatbot that spits out text. It uses the Google Gemini API with **Structured Outputs** to actively analyze natural language.
- **Intent Detection:** Automatically figures out if you are trying to check eligibility, register, or find a polling place.
- **Entity Extraction:** If you say, "I'm a 19-year-old student living in Texas," VoteMate extracts your age and location instantly.

### 2. Live Voter Profile Dashboard
As the AI extracts your entities (Age, Location, Status), it populates a visual **Voter Profile** on the sidebar in real-time, proving the system's context awareness.

### 3. Dynamic Progress & Timeline Intelligence
- **Progress Tracker:** A dynamic 5-step UI (Eligibility -> Registration -> Deadlines -> Documents -> Voting) that updates automatically as the AI determines your current step.
- **Timeline Renderer:** When deadlines are discussed, the AI structures them into a dedicated timeline widget.

### 4. Interactive Simulation (Demo Mode)
Perfect for hackathon pitches, the **"Run Demo Journey"** button auto-plays a conversation of a confused first-time voter navigating absentee voting, showcasing the NLP entity extraction and UI updates without manual typing.

### 5. Inclusivity (Voice & Multi-Language)
- **Web Speech API:** Click the microphone to speak your questions, and click "Listen" to have the AI read answers aloud.
- **Language Selector:** Seamlessly switch between English, Spanish, and French. The AI intelligently translates its logic and output.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Vanilla CSS Modules (Custom Design System)
- **AI/NLP Engine:** Google Gemini (`@google/genai` SDK) utilizing Structured JSON Outputs.
- **Package Manager:** Bun
- **Extras:** `canvas-confetti`, `react-markdown`

---

## 🚀 Getting Started

### Prerequisites
1. Install [Bun](https://bun.sh/) (`curl -fsSL https://bun.sh/install | bash`)
2. Get a Google Gemini API Key from Google AI Studio.

### Installation

1. **Clone the repository (or navigate to the project directory):**
   ```bash
   cd ElectionManager.
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 How the AI Works (The Secret Sauce)

The magic happens in `src/app/api/chat/route.ts`. Instead of asking Gemini for a string, we define a strict JSON Schema:

```typescript
const responseSchema = {
  response: "The text response",
  intent: "check_eligibility",
  userContext: { age: 19, location: "Texas" },
  currentStepId: 2,
  timelineHighlights: [{ date: "Oct 15", event: "Registration Deadline" }]
}
```

By forcing the LLM to act as a structured analytics engine, we decouple the intelligence from the UI. The React frontend simply consumes this JSON to animate progress bars, populate sidebars, and render timelines dynamically.

---

## 📄 Documentation

For deeper technical details, see the accompanying markdown files:
- [Architecture](architecture.md)
- [Design & UX](design.md)
