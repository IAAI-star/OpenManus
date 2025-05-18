import { useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import PlanDisplay from './components/PlanDisplay';
import { wsService } from './services/websocket';
import { useChatStore } from './store';
import { Message } from './types';

function App() {
  const { messages, isConnected, addMessage, updatePlan, setIsConnected, setIsLoading } = useChatStore();

  useEffect(() => {
    wsService.onMessage((message: Message) => {
      addMessage(message);
      setIsLoading(false);
    });

    wsService.onPlanUpdate((plan) => {
      updatePlan(plan);
    });

    wsService.onConnectionChange((connected) => {
      setIsConnected(connected);
    });

    return () => {
      wsService.disconnect();
    };
  }, [addMessage, updatePlan, setIsConnected, setIsLoading]);

  const handleSendMessage = (content: string) => {
    const message: Message = { role: 'user', content };
    addMessage(message);
    setIsLoading(true);
    wsService.sendMessage(content);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className={`px-4 py-2 rounded-lg ${isConnected ? 'bg-green-500' : 'bg-red-500'} text-white inline-block`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
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