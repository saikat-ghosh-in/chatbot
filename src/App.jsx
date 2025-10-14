import { useState, useRef, useEffect } from 'react'
import BotProfileImg from './assets/images/robot.png'
import UserProfileImg from './assets/images/user.png'
import LoadingSpinnerGif from './assets/gifs/loading-spinner.gif'
import {Chatbot} from 'supersimpledev'
import './App.css'

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




// to handle all input feature
function ChatInput({ setChatMessages }) {
  const [inputText, setInputText] = useState('');

  // saves into inputText
  function saveChatMessage(event) {
    setInputText(event.target.value);
  }

  // adds inputText to chatMessages with default sender: "user"
  function sendChatMessage() {
    let botResponse = '';
    if (inputText === '') {
      return;
    } else if (inputText.toLowerCase() === 'hi') {
      botResponse = Chatbot.getResponse('Hello');
    } else {
      botResponse = Chatbot.getResponse(inputText);
    }

    // add user's message immediately
    const userMsg = { message: inputText, sender: "user", id: crypto.randomUUID() };
    // add a loading placeholder for bot
    const loadingBotId = crypto.randomUUID();
    const loadingBotMsg = { message: '', sender: "bot", id: loadingBotId, loading: true };

    setChatMessages(prev => ([
      ...prev,
      userMsg,
      loadingBotMsg
    ]));
    setInputText('');

    // after 1 second, replace the loading message with typed bot response
    typeOutResponse(loadingBotId, botResponse, setChatMessages);
  }

  function sendChatMessageOnEnterKeyPress(event) {
    event.key === 'Enter' ? sendChatMessage() : undefined;
  }

  return (
    <div className="chat-input-container">
      <input className="chat-input-box" placeholder="Ask me something"
        onChange={saveChatMessage} onKeyPress={sendChatMessageOnEnterKeyPress} value={inputText} />
      <button className="send-button" onClick={sendChatMessage}>Send</button>
    </div>
  );
}

// helper: show spinner for 1s, then reveal `text` char-by-char inside the message with id `msgId`
function typeOutResponse(msgId, text, setChatMessages) {
  const initialDelay = 1000; // spinner duration
  const minCharDelay = 5; // ms
  const maxCharDelay = 15; // ms

  setTimeout(() => {
    let current = '';
    let i = 0;

    function step() {
      if (i <= text.length) {
        current = text.slice(0, i);
        setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, message: current, loading: false } : m));
        i++;
        const delay = Math.floor(Math.random() * (maxCharDelay - minCharDelay + 1)) + minCharDelay;
        setTimeout(step, delay);
      }
    }

    step();
  }, initialDelay);
}




// iterate chatMessages array and generate html with all chat messages
function ChatMessages({ chatMessages }) {

  const chatMessagesRef = useRef(null); // creates a ref that lets React save any html element inside this ref
  useEffect(() => { // React will run this function everytime the component is created/ updated
    const containerElem = chatMessagesRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight; /*Scroll from top to the bottom upto the given height,
          height is given here as containerElem.scrollHeight which is total scrollable height for this container*/
    }
  }, [chatMessages]);
  // by giving this 2nd param, we're telling React to run the function everytime chatMessages is created/ updated

  return (
    <div className="chat-messages-container" ref={chatMessagesRef /*giving the ref as property
           to save this html component inside chatMessagesRef */}>
      {chatMessages.map((chatMessage) => {
        return (
          <ChatMessage message={chatMessage.message} sender={chatMessage.sender} loading={chatMessage.loading} key={chatMessage.id} />
        );
      })}
    </div>
  );
}

// to generate chat message html based on sender
function ChatMessage({ message, sender, loading }) {
  return (
    <div className=
      {sender === 'user'
        ? 'chat-message-user'
        : 'chat-message-bot'
      }>
      {sender === 'bot' && (
        <img src={BotProfileImg} className="chat-message-profile" />
      )}
      <div className="chat-message-text">
        {loading ? (
          <img src={LoadingSpinnerGif} alt="loading..." className="loading-spinner" />
        ) : (
          message
        )}
      </div>
      {sender === 'user' && (
        <img src={UserProfileImg} className="chat-message-profile" />
      )}
    </div>
  );
}