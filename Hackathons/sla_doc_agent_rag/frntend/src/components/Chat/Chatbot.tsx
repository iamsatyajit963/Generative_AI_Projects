import { useState, useRef, useEffect } from "react";
import { MessageCircle, Minimize2, X, ChevronDown } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import axios from "axios";
import { useFiles } from "../../contexts/FileContext";

interface ChatbotProps {
  userAvatar?: string;
}

export const Chatbot = ({ userAvatar }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedModel } = useFiles();

  const [isMinimized, setIsMinimized] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Hi! How can I help you today?",
      isBot: true,
    },
  ]);

  // Create a ref for the end of the message list
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (message: string) => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, message, isBot: false },
      { id: prev.length + 2, message: "I'm processing your request...", isBot: true },
    ]);

    try {
      const requestBody = {
        question: message,
        model: selectedModel,
      };
      console.log("chat request", requestBody);

      const response = await axios.post("http://127.0.0.1:8000/chat", requestBody);
      console.log(response.data, "response", requestBody);
      const botMessage = response.data.answer;
      const sources = response.data.sources
        .map((source: { source: any; page_number: any }) => `${source.source} (Page ${source.page_number})`)
        .join(", ");

      setMessages((prev) => [
        ...prev,
        { id: prev.length + 3, message: botMessage, isBot: true },
        { id: prev.length + 4, message: `Sources: ${sources}`, isBot: true },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 3, message: "Sorry, I couldn't process your request.", isBot: true },
      ]);
    }
  };

  const toggleChatbot = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(true);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
        <MessageCircle size={24} className="text-purple-600" />
        <span className="font-medium">Chat with AI</span>
        <button
          onClick={toggleChatbot}
          className="text-gray-400 hover:text-gray-600"
        >
          <ChevronDown size={20} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-lg flex flex-col"
      style={{ maxHeight: "80vh", minHeight: "400px" }}
    >
      <div className="p-4 border-b flex items-center justify-between bg-purple-600 text-white rounded-t-lg">
        <h3 className="font-semibold">Chat with AI</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleChatbot}
            className="text-white hover:text-gray-200"
          >
            <Minimize2 size={20} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            isBot={msg.isBot}
            message={msg.message}
            avatar={!msg.isBot ? userAvatar : undefined}
          />
        ))}
        {/* This hidden div marks the end of the messages list */}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
};