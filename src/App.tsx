import { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import PlanDisplay from './components/PlanDisplay';

function App() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  const handleSendMessage = (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    // TODO: Send message to backend and handle response
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChatWindow messages={messages} />
            <InputArea onSendMessage={handleSendMessage} />
          </div>
          <div className="lg:col-span-1">
            <PlanDisplay />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;