import React, { useState, useEffect, useRef } from 'react';
import { MessageSquareText, Send, X, Bot, BrainCircuit } from 'lucide-react'; // Added more icons for options

interface AIAssistantButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  created_at?: string;
}

const AIAssistantButton = ({ isOpen, setIsOpen }: AIAssistantButtonProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const API_BASE_URL = 'https://kajet24.work.gd/api';

  const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    } else {
      setMessages([]);
    }
  }, [isOpen]);

  const fetchChatHistory = async () => {
    setIsLoading(true);
    const token = getAccessToken();

    try {
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const historyMessages: ChatMessage[] = data.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role === 'user' ? 'user' : 'assistant',
        text: msg.text,
        created_at: msg.created_at,
      }));
      setMessages(historyMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setMessages([{ id: Date.now(), role: 'assistant', text: 'Failed to load chat history.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text: inputMessage,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    const token = getAccessToken();

    try {
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ prompt: userMessage.text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.answer,
      };

      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), role: 'assistant', text: 'Sorry, I could not get a response from the AI.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-110 active:scale-95 z-50 flex items-center justify-center"
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {/* Choose one of the icons: MessageSquareText, Bot, BrainCircuit */}
        {isOpen ? <X size={24} /> : <BrainCircuit size={24} />} 
      </button>

      {/* AI Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 max-h-[80vh] h-auto bg-white rounded-xl shadow-2xl flex flex-col z-40 border border-gray-100 overflow-hidden animate-slideUpAndFade">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-xl shadow-md">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Bot size={20} /> AI Assistant
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-100 focus:outline-none transition-transform hover:rotate-90 duration-300"
              aria-label="Close chat"
            >
              <X size={24} />
            </button>
          </div>

          {/* Chat Body (Scrollable) */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 custom-scrollbar">
            {isLoading && messages.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
                Loading chat history...
              </div>
            ) : (
              messages.length === 0 && !isLoading ? (
                <div className="text-center text-gray-500 py-4">
                  Start a conversation with your AI assistant!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-3 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl max-w-[80%] break-words shadow-sm text-sm ${
                        msg.role === 'user'
                          ? 'bg-indigo-500 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={isLoading ? "Sending..." : "Type your message..."}
                className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors duration-200 flex-shrink-0"
                disabled={isLoading}
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistantButton;