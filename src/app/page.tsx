/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { ProgressTracker } from '../components/ProgressTracker';
import { VoterProfile } from '../components/VoterProfile';
import { Timeline as TimelineComponent } from '../components/Timeline';
import styles from './page.module.css';
import {
  Message,
  UserContext,
  TimelineEvent,
  ApiResponse,
  ELECTION_STEPS,
  INITIAL_QUICK_REPLIES,
  INITIAL_BOT_MESSAGE,
} from '../types';

const INITIAL_MESSAGE: Message = { role: 'model', content: INITIAL_BOT_MESSAGE };

/** Strip markdown syntax so text-to-speech doesn't read symbols aloud */
const stripMarkdown = (text: string) =>
  text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/#+\s/g, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .trim();

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [quickReplies, setQuickReplies] = useState<string[]>(INITIAL_QUICK_REPLIES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({ age: null, location: null, isRegistered: null });
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [language, setLanguage] = useState('English');
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      void confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      void confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = language === 'Spanish' ? 'es-ES' : language === 'French' ? 'fr-FR' : 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => setInput(event.results[0][0].transcript);
    recognition.onerror = (event: any) => {
      const errorMessage = event.error || 'Unknown speech recognition error';
      console.warn('Speech recognition error:', errorMessage);
      if (errorMessage === 'not-allowed') alert('Microphone access was denied. Please allow microphone permissions.');
      else if (errorMessage === 'network') alert("Browser speech service could not connect. Use text input instead.");
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  }, [language]);

  const speakText = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(stripMarkdown(text));
    utterance.lang = language === 'Spanish' ? 'es-ES' : language === 'French' ? 'fr-FR' : 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [language]);

  /** Merges partial user context from API response into state, preserving existing values */
  const mergeUserContext = useCallback((prev: UserContext, next: Partial<UserContext> | undefined): UserContext => {
    if (!next) return prev;
    return {
      age: next.age != null ? next.age : prev.age,
      location: next.location != null ? next.location : prev.location,
      isRegistered: next.isRegistered != null ? next.isRegistered : prev.isRegistered,
    };
  }, []);

  /** Processes an API response object and updates all relevant state */
  const processApiResponse = useCallback((data: ApiResponse, prevActiveStep: number) => {
    if (data.userContext) setUserContext(prev => mergeUserContext(prev, data.userContext));
    if (data.timelineHighlights && data.timelineHighlights.length > 0) setTimeline(data.timelineHighlights);
    if (data.currentStepId && data.currentStepId >= 1 && data.currentStepId <= 5) {
      if (data.currentStepId === 5 && prevActiveStep !== 5) triggerConfetti();
      setActiveStep(data.currentStepId);
    }
    if (Array.isArray(data.suggestedReplies)) setQuickReplies(data.suggestedReplies);
  }, [mergeUserContext, triggerConfetti]);

  const callApi = useCallback(async (
    message: string,
    history: Message[],
    ctx: UserContext
  ): Promise<ApiResponse | null> => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, language, currentUserContext: ctx }),
      });
      const text = await res.text();
      const data: ApiResponse = JSON.parse(text);
      if (!res.ok) return null;
      return data;
    } catch {
      return null;
    }
  }, [language]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading || isDemoRunning) return;
    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setQuickReplies([]);
    setIsLoading(true);

    const data = await callApi(text, messages, userContext);
    if (data && data.response) {
      setMessages(prev => [...prev, { role: 'model', content: data.response }]);
      processApiResponse(data, activeStep);
    } else {
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I couldn't get a response. Please try again." }]);
    }
    setIsLoading(false);
  }, [isLoading, isDemoRunning, messages, userContext, activeStep, callApi, processApiResponse]);

  const runDemoJourney = useCallback(async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setMessages([INITIAL_MESSAGE]);
    setActiveStep(1);
    setQuickReplies([]);
    setUserContext({ age: null, location: null, isRegistered: null });
    setTimeline([]);

    const demoScript = [
      "I just turned 18! I go to college in New York, but my home is in Texas. I am not registered yet.",
      "What is the deadline for registering in Texas?",
      "Okay, I want to vote in Texas using an absentee ballot. What documents do I need?",
      "Got it! I mailed it in. What's next?",
    ];

    const history: Message[] = [INITIAL_MESSAGE];
    let ctx: UserContext = { age: null, location: null, isRegistered: null };
    let step = 1;

    for (const text of demoScript) {
      await new Promise(resolve => setTimeout(resolve, 2200));
      const userMsg: Message = { role: 'user', content: text };
      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);

      const data = await callApi(text, history, ctx);
      if (data && data.response) {
        const botMsg: Message = { role: 'model', content: data.response };
        setMessages(prev => [...prev, botMsg]);
        history.push(userMsg, botMsg);

        // Merge context locally so next demo turn benefits from it
        ctx = mergeUserContext(ctx, data.userContext);
        if (data.timelineHighlights && data.timelineHighlights.length > 0) setTimeline(data.timelineHighlights);
        if (data.currentStepId && data.currentStepId >= 1 && data.currentStepId <= 5) {
          if (data.currentStepId === 5 && step !== 5) triggerConfetti();
          step = data.currentStepId;
          setActiveStep(step);
        }
        if (Array.isArray(data.suggestedReplies)) setQuickReplies(data.suggestedReplies);
        setUserContext(ctx);
      }
      setIsLoading(false);
    }
    setIsDemoRunning(false);
  }, [isDemoRunning, callApi, mergeUserContext, triggerConfetti]);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>VoteMate</h1>
        <p className={styles.subtitle}>Your intelligent, AI-powered voting companion</p>
        <div className={styles.headerControls}>
          <select
            className={styles.languageSelect}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isDemoRunning || isLoading}
            aria-label="Select language"
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
          </select>
          <button
            className={styles.demoButton}
            onClick={runDemoJourney}
            disabled={isDemoRunning || isLoading}
            aria-label="Run demo voter journey"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            {isDemoRunning ? 'Running...' : 'Run Demo Journey'}
          </button>
        </div>
      </header>

      <ProgressTracker activeStep={activeStep} steps={ELECTION_STEPS} />

      <div className={styles.mainContent}>
        <div className={styles.chatSection}>
          <div className={styles.chatArea} role="log" aria-live="polite" aria-label="Conversation">
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.messageRow} ${styles[msg.role]}`}>
                <div className={`${styles.messageBubble} ${styles[msg.role]} animate-fade-in`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  {msg.role === 'model' && (
                    <button
                      className={styles.speakBtn}
                      onClick={() => speakText(msg.content)}
                      title="Read Aloud"
                      aria-label="Read AI response aloud"
                      tabIndex={0}
                    >
                      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                      Listen
                    </button>
                  )}
                </div>

                {msg.role === 'model' && index === messages.length - 1 && !isLoading && quickReplies.length > 0 && (
                  <div className={`${styles.quickReplies} animate-fade-in`} role="group" aria-label="Suggested replies">
                    {quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        className={styles.quickReplyBtn}
                        onClick={() => handleSend(reply)}
                        aria-label={`Quick reply: ${reply}`}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.messageRow} ${styles.bot}`} aria-label="VoteMate is thinking">
                <div className={styles.loadingIndicator}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <button
              className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
              onClick={startRecording}
              title={isRecording ? 'Recording...' : 'Start voice input'}
              aria-label={isRecording ? 'Recording in progress' : 'Start voice input'}
              tabIndex={0}
              disabled={isDemoRunning || isLoading}
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            </button>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Type or say your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              disabled={isLoading || isDemoRunning}
              aria-label="Chat input"
              maxLength={1000}
            />
            <button
              className={styles.sendButton}
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim() || isDemoRunning}
              aria-label="Send message"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.sidebar}>
          <VoterProfile userContext={userContext} />
          <TimelineComponent events={timeline} />
        </div>
      </div>
    </main>
  );
}
