
import { ChatInput } from './components/ChatInput';
import { ChatMessages } from './components/ChatMessages';
import { typeOutResponse } from './components/Utils'; // no need to mention .jsx
import './App.css';

import { useState, useRef, useEffect } from 'react'

// main app
export function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // persist theme to localStorage and set data-theme on body for CSS
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // show a welcome bot message using spinner + typed response
  const welcomeShownRef = useRef(false);
  useEffect(() => {
    if (welcomeShownRef.current) return;
    welcomeShownRef.current = true;

    const welcomeText = 'Hello! I am your friendly chatbot. How can I help you today?';
    const loadingBotId = crypto.randomUUID();
    const loadingBotMsg = { message: '', sender: "bot", id: loadingBotId, loading: true };
    setChatMessages(prev => ([...prev, loadingBotMsg]));
    typeOutResponse(loadingBotId, welcomeText, setChatMessages);
  }, [] );

  return (
    <div className="app-container">
      <ChatMessages chatMessages={chatMessages} />
      <ChatInput setChatMessages={setChatMessages} />
      <div className="toggle-button-container">
        <div className="theme-toggle" onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} role="button" tabIndex={0}>
          <div className="toggle-track">
            <div className={`toggle-thumb ${theme === 'dark' ? 'dark' : 'light'}`}></div>
          </div>
          <div className="toggle-label">{theme === 'light' ? 'Light' : 'Dark'}</div>
        </div>
      </div>
    </div>
  );
}
