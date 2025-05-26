// FinPal: Your Finance Pal
import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "./components/input";
import { Button } from "./components/button";
import ReactMarkdown from 'react-markdown';
import "./App.css";


export default function Finterpreter() {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isInitial, setIsInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(""); // For typewriter
  const [displayedMessage, setDisplayedMessage] = useState(""); // For typewriter

  const examplePrompts = [
    "What is compound interest?",
    "Explain inflation like I'm five",
    "How do credit scores work?",
  ];

  const isNearBottom = () => {
    const container = chatContainerRef.current;
    if (!container) return false;
    
    const threshold = 100; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  const handleScroll = () => {
    setShouldAutoScroll(isNearBottom());
  };

const scrollToBottom = useCallback(() => {
  if (shouldAutoScroll) {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [shouldAutoScroll]);

useEffect(() => {
  scrollToBottom();
}, [messages, scrollToBottom]);
  
  // Typewriter effect for bot reply
  useEffect(() => {
    if (!pendingMessage) return;
    const words = pendingMessage.split(" ");
    let idx = 0;
    setDisplayedMessage(""); // Reset before starting

    const interval = setInterval(() => {
      setDisplayedMessage(prev => prev + (idx > 0 ? " " : "") + words[idx]);
      idx++;
      if (idx >= words.length) {
        clearInterval(interval);
        setMessages(prev => [...prev, { role: 'system', content: pendingMessage }]);
        setPendingMessage("");
        setLoading(false);
        setDisplayedMessage(""); // ← Add this line to clear the typewriter
      }
    }, 40);

    return () => clearInterval(interval);
  }, [pendingMessage]);

  // Update handleSend to use typewriter
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setIsInitial(false);
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setLoading(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPendingMessage(data.response); // Set for typewriter
      setDisplayedMessage(""); // Reset
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
      setLoading(false);
    }
    setInput('');
  };

  const handleExampleClick = (text) => {
    setInput(text);
  };

  return (
    <div className="app">
      {/* App Name Header */}
      <header className={isInitial ? 'header-centered' : 'header-top'}>
        <div className="title">FinPal</div>
        {isInitial && <div className="tagline">Your Finance Pal</div>}
      </header>

      {/* Chat Area */}
      <main 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className={`${!isInitial ? 'main-visible' : ''}`}
      >
        <div className="chat-container">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`message-wrapper ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`message ${
                msg.role === 'user' ? 'user-message' : 'system-message'
              }`}>
                {msg.role === 'system'
                  ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                  : msg.content}
              </div>
            </div>
          ))}
          {/* Show animated dots or typewriter effect while loading */}
          {loading && !pendingMessage && (
            <div className="message-wrapper justify-start">
              <div className="dots-bubble">
                <span className="dot dot1"></span>
                <span className="dot dot2"></span>
                <span className="dot dot3"></span>
              </div>
            </div>
          )}
          {displayedMessage && (
            <div className="message-wrapper justify-start">
              <div className="message system-message">
                <ReactMarkdown>{displayedMessage}</ReactMarkdown>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Only show suggestions when in initial state */}
      {isInitial && (
        <div className="suggestions">
          {examplePrompts.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleClick(ex)}
              className="suggestion-button"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <footer className="footer">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything about finance..."
          className="flex-1 min-w-0"
          disabled={loading}
        />
        {loading ? (
          <Button disabled>
            <span className="spinner" />
          </Button>
        ) : (
          <Button onClick={handleSend}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Button>
        )}
      </footer>
    </div>
  );
}


/*
next steps:
4. add a pen writing or interpreting animation
7. upload project!
*/