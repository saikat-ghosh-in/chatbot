
import { ChatMessage } from './ChatMessage.jsx'

import { useRef, useEffect } from 'react'

// iterate chatMessages array and generate html with all chat messages
export function ChatMessages({ chatMessages }) {

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