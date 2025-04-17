import { Copy } from "lucide-react";

interface ChatMessageProps {
  isBot: boolean;
  message: string;
  avatar?: string;
}

export const ChatMessage = ({ isBot, message, avatar }: ChatMessageProps) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(message)
      .then(() => {
        console.log("Message copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy message: ", err);
      });
  };

  return (
    <div
      className={`flex items-start space-x-3 ${
        isBot ? "bg-purple-50" : ""
      } p-4 rounded-lg`}
    >
      {avatar ? (
        <img src={avatar} alt="User" className="w-8 h-8 rounded-full" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
          <span className="text-white text-sm">🤖</span>
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-gray-800">{message}</p>
        {isBot && (
          <button
            onClick={handleCopy}
            className="mt-2 text-purple-600 text-sm flex items-center space-x-1 hover:text-purple-700"
          >
            <Copy size={16} />
            <span>Copy</span>
          </button>
        )}
      </div>
    </div>
  );
};