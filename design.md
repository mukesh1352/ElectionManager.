# VoteMate Design & UX System

VoteMate is designed to feel less like a clinical government form and more like a premium, modern consumer application. The design language prioritizes clarity, accessibility, and a "wow" factor suitable for hackathons and public deployments.

## 1. Visual Language
- **Theme:** A deep, modern dark mode (`--background: #0f172a`). This reduces eye strain and makes the vibrant accent colors pop.
- **Typography:** The `Inter` font stack is used for its exceptional readability at small sizes and sleek, geometric proportions.
- **Color Palette:**
  - **Primary:** Bright Blue (`#3b82f6`) - Used for user actions and primary indicators.
  - **Accent:** Vivid Violet (`#8b5cf6`) to Coral Pink (`#f43f5e`) - Used sparingly in gradients to indicate AI intelligence or celebratory actions.
  - **Neutrals:** Slate grays (`#1e293b`, `#64748b`) - Used for structural elements, borders, and secondary text.

## 2. Component Design

### The Chat Interface
The core interaction takes place in the chat area.
- **User Bubbles:** Feature a primary gradient to signify ownership and action.
- **AI Bubbles:** Subtle slate backgrounds with clean borders, ensuring the focus remains on the content. Markdown support ensures bullet points, bold text, and links are parsed beautifully.
- **Loading State:** A pulsing three-dot animation mimics human typing, providing visual feedback that the AI is processing the query.

### The Personalization Sidebar (Voter Profile)
To prove the AI's intelligence, the extracted user data is visualized in a sidebar card. 
- It uses a clean, key-value layout. 
- Unknown values are styled with italicized, subdued text to subtly encourage the user to provide that information.

### The Dynamic Progress Tracker
Located at the top of the chat, this 5-step tracker (Eligibility -> Registration -> Deadlines -> Documents -> Voting) anchors the user in the process.
- **Interaction:** As the backend AI updates the `currentStepId`, the tracker animates its progress bar and highlights the active step with a glowing effect and scaled-up icon.

### Quick Replies
To reduce friction for beginners, contextual quick replies appear beneath the AI's latest message. These are styled as pill-shaped, outline buttons that invite clicking without dominating the visual hierarchy.

## 3. Micro-Interactions & Delight
- **Animations:** Subtle CSS keyframes are used throughout. The main title features a slow `hue-rotate` pulse to signify "AI Intelligence". Chat bubbles fade in gracefully (`animate-fade-in`).
- **Confetti:** Upon reaching Step 5, the `canvas-confetti` library triggers a celebratory burst across the screen, rewarding the user for completing the complex journey.

## 4. Accessibility & Inclusivity
- **Voice UI:** Microphone and text-to-speech buttons ensure users who struggle with typing or reading can still navigate the election process.
- **Multi-Language:** A prominent dropdown allows non-native speakers to interact in their preferred language instantly.
