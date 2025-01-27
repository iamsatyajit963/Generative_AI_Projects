import { PaperclipIcon, Send } from 'lucide-react';
import { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600"
        >
          <PaperclipIcon size={20} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask or search anything"
          className="flex-1 py-2 px-3 bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          className="text-purple-600 hover:text-purple-700"
          disabled={!message.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};