import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatbotContextType {
  messages: Message[];
  addMessage: (text: string, sender: 'user' | 'bot') => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      sender,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <ChatbotContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}