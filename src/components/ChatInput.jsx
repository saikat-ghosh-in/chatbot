
import { typeOutResponse } from './Utils.jsx';

import {Chatbot} from 'supersimpledev'
import { useState } from 'react'

// to handle all input feature
export function ChatInput({ setChatMessages }) {
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

