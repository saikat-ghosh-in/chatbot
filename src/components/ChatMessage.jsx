
import BotProfileImg from '../assets/images/robot.png'
import UserProfileImg from '../assets/images/user.png'
import LoadingSpinnerGif from '../assets/gifs/loading-spinner.gif'

// to generate chat message html based on sender
export function ChatMessage({ message, sender, loading }) {
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