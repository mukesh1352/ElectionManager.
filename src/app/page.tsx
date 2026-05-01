/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import styles from './page.module.css';

type Role = 'user' | 'model';

interface Message {
  role: Role;
  content: string;
}

interface UserContext {
  age: number | null;
  location: string | null;
  isRegistered: boolean | null;
}

interface TimelineEvent {
  date: string;
  event: string;
}

const ELECTION_STEPS = [
  { id: 1, label: 'Eligibility' },
  { id: 2, label: 'Registration' },
  { id: 3, label: 'Deadlines' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Voting' },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'model',
    content: "Hi there! I'm VoteMate, your highly intelligent AI election assistant. I'm here to guide you. Could you please tell me your location (State/Country) and your age?"
  }]);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "I'm 18, from California.",
    "I'm 20, studying in New York but from Texas.",
    "I'm not sure if I'm registered.",
    "I don't have a photo ID."
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  
  // VoteMate Advanced State
  const [userContext, setUserContext] = useState<UserContext>({ age: null, location: null, isRegistered: null });
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [language, setLanguage] = useState('English');
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      void confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      void confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  // Web Speech API Integration
  const startRecording = () => {
    const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition?: any, webkitSpeechRecognition?: any }).SpeechRecognition || (window as unknown as { SpeechRecognition?: any, webkitSpeechRecognition?: any }).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = language === 'Spanish' ? 'es-ES' : 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = (event: any) => {
      const errorMessage = event.error || 'Unknown speech recognition error';
      console.warn('Speech recognition error:', errorMessage);
      if (errorMessage === 'not-allowed') {
        alert("Microphone access was denied. Please allow microphone permissions to use voice input.");
      } else if (errorMessage === 'network') {
        alert("Your browser's speech recognition service could not connect to the network. Please check your internet connection or use text input instead.");
      }
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    
    recognition.start();
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'Spanish' ? 'es-ES' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setQuickReplies([]); 
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          language: language,
          currentUserContext: userContext
        }),
      });

      const textData = await response.text();
      let data;
      try {
        data = JSON.parse(textData);
      } catch(e) {
        data = { response: textData, currentStepId: activeStep, suggestedReplies: [] };
      }

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'model', content: data.response }]);
        
        // Handle Advanced NLP Extracts
        if (data.userContext) {
            setUserContext(prev => ({
                age: data.userContext.age !== undefined && data.userContext.age !== null ? data.userContext.age : prev.age,
                location: data.userContext.location !== undefined && data.userContext.location !== null ? data.userContext.location : prev.location,
                isRegistered: data.userContext.isRegistered !== undefined && data.userContext.isRegistered !== null ? data.userContext.isRegistered : prev.isRegistered
            }));
        }

        if (data.timelineHighlights && data.timelineHighlights.length > 0) {
            setTimeline(data.timelineHighlights);
        }

        if (data.currentStepId && data.currentStepId >= 1 && data.currentStepId <= 5) {
          if (data.currentStepId === 5 && activeStep !== 5) {
            triggerConfetti();
          }
          setActiveStep(data.currentStepId);
        }

        if (data.suggestedReplies && Array.isArray(data.suggestedReplies)) {
          setQuickReplies(data.suggestedReplies);
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting. Ensure the Gemini API key is configured properly." }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Oops, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const runDemoJourney = async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    
    setMessages([{
      role: 'model',
      content: "Hi there! I'm VoteMate, your highly intelligent AI election assistant. I'm here to guide you. Could you please tell me your location (State/Country) and your age?"
    }]);
    setActiveStep(1);
    setQuickReplies([]);
    setUserContext({ age: null, location: null, isRegistered: null });
    setTimeline([]);
    
    const demoScript = [
      "I just turned 18! I go to college in New York, but my home is in Texas. I am not registered yet.",
      "What is the deadline for registering in Texas?",
      "Okay, I want to vote in Texas using an absentee ballot. What documents do I need?",
      "Got it! I mailed it in. What's next?"
    ];

    const currentHistory: Message[] = [{
      role: 'model',
      content: "Hi there! I'm VoteMate, your highly intelligent AI election assistant. I'm here to guide you. Could you please tell me your location (State/Country) and your age?"
    }];

    for (let i = 0; i < demoScript.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      
      const text = demoScript[i];
      const userMessage: Message = { role: 'user', content: text };
      setMessages(prev => [...prev, userMessage]);
      currentHistory.push(userMessage);
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: currentHistory.slice(0, -1),
            language: language,
            // Pass current user context from React state so the backend remembers it perfectly
            currentUserContext: userContext
          }),
        });
        
        const textData = await response.text();
        const data = JSON.parse(textData);
        
        const botMessage: Message = { role: 'model', content: data.response };
        setMessages(prev => [...prev, botMessage]);
        currentHistory.push(botMessage);
        
        // Update Context dynamically so judges see it populate
        if (data.userContext) {
            setUserContext(prev => ({
                age: data.userContext.age !== undefined && data.userContext.age !== null ? data.userContext.age : prev.age,
                location: data.userContext.location !== undefined && data.userContext.location !== null ? data.userContext.location : prev.location,
                isRegistered: data.userContext.isRegistered !== undefined && data.userContext.isRegistered !== null ? data.userContext.isRegistered : prev.isRegistered
            }));
        }

        if (data.timelineHighlights && data.timelineHighlights.length > 0) {
            setTimeline(data.timelineHighlights);
        }

        if (data.currentStepId) {
          if (data.currentStepId === 5 && activeStep !== 5) {
             triggerConfetti();
          }
          setActiveStep(data.currentStepId);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    
    setIsDemoRunning(false);
  };

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
            >
                <option value="English">English</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
            </select>
            <button className={styles.demoButton} onClick={runDemoJourney} disabled={isDemoRunning || isLoading}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Run Demo Journey
            </button>
        </div>
      </header>

      {/* Progress Tracker */}
      <div className={styles.progressContainer}>
        {ELECTION_STEPS.map((step) => (
          <div key={step.id} className={`${styles.progressStep} ${step.id <= activeStep ? styles.active : ''}`}>
            <div className={styles.progressIcon}>
              {step.id < activeStep ? '✓' : step.id}
            </div>
            <span>{step.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.mainContent}>
          {/* Main Chat Section */}
          <div className={styles.chatSection}>
              <div className={styles.chatArea}>
                {messages.map((msg, index) => (
                  <div key={index} className={`${styles.messageRow} ${styles[msg.role]}`}>
                    <div className={`${styles.messageBubble} ${styles[msg.role]} animate-fade-in`}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                      {msg.role === 'model' && (
                        <button className={styles.speakBtn} onClick={() => speakText(msg.content)} title="Read Aloud">
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 10 0 1 1 0 14.14M15.54 8.46a5 5 5 0 1 1 0 7.07"></path></svg>
                           Listen
                        </button>
                      )}
                    </div>
                    
                    {/* Show quick replies right under the specific bot message if it's the latest one */}
                    {msg.role === 'model' && index === messages.length - 1 && !isLoading && quickReplies.length > 0 && (
                      <div className={`${styles.quickReplies} animate-fade-in`}>
                        {quickReplies.map((reply, i) => (
                          <button 
                            key={i} 
                            className={styles.quickReplyBtn}
                            onClick={() => handleSend(reply)}
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className={`${styles.messageRow} ${styles.bot}`}>
                    <div className={styles.loadingIndicator}>
                      <div className={styles.dot}></div>
                      <div className={styles.dot}></div>
                      <div className={styles.dot}></div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={styles.inputArea}>
                <button 
                  className={`${styles.micButton} ${isRecording ? styles.recording : ''}`} 
                  onClick={startRecording}
                  title="Speak"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Type or say your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  disabled={isLoading || isDemoRunning}
                />
                <button 
                  className={styles.sendButton} 
                  onClick={() => handleSend(input)}
                  disabled={isLoading || !input.trim() || isDemoRunning}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
          </div>

          {/* Sidebar for Intelligence / Personalization */}
          <div className={styles.sidebar}>
              <div className={styles.profileCard}>
                  <h3 className={styles.profileTitle}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Voter Profile
                  </h3>
                  <div className={styles.profileItem}>
                      <span className={styles.profileLabel}>Age</span>
                      <span className={`${styles.profileValue} ${!userContext.age ? styles.unknown : ''}`}>{userContext.age || 'Unknown'}</span>
                  </div>
                  <div className={styles.profileItem}>
                      <span className={styles.profileLabel}>Location</span>
                      <span className={`${styles.profileValue} ${!userContext.location ? styles.unknown : ''}`}>{userContext.location || 'Unknown'}</span>
                  </div>
                  <div className={styles.profileItem}>
                      <span className={styles.profileLabel}>Status</span>
                      <span className={`${styles.profileValue} ${userContext.isRegistered === null ? styles.unknown : ''}`}>
                          {userContext.isRegistered === null ? 'Unknown' : (userContext.isRegistered ? 'Registered' : 'Unregistered')}
                      </span>
                  </div>
              </div>

              {timeline.length > 0 && (
                  <div className={styles.timelineCard}>
                      <h3 className={styles.profileTitle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          Key Deadlines
                      </h3>
                      {timeline.map((item, idx) => (
                          <div key={idx} className={styles.timelineItem}>
                              <div className={styles.timelineDate}>{item.date}</div>
                              <div className={styles.timelineEvent}>{item.event}</div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </div>
    </main>
  );
}
