import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { useChatStore } from '../store';

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow = ({ messages }: ChatWindowProps) => {
  const { isLoading } = useChatStore();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 h-[600px] overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${
            message.role === 'user' ? 'text-right' : 'text-left'
          }`}
        >
          <div
            className={`inline-block p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;