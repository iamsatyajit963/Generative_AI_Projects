import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from './FileUpload';
import DocumentList from './DocumentList';
import DocumentViewer from './DocumentViewer';
import { useClickOutside } from '../hooks/useClickOutside';
import { Chatbot } from './Chat/Chatbot';
import { Sparkles, Upload, ChevronDown, LogOut, User } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { selectedModel,setSelectedModel } = useFiles();
    const [selectedModelLabel, setSelectedModelLabel] = useState<string | null>('GPT4 MINI'); // New state for selected model
    
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

//   GPT4 MINI = "gpt-4o-mini" ---> At the top and default during log in
// GPT4 = "gpt-4o"
// Llamma 3.2 = "llama3.2"
// Phi 3 = "phi3"
// Mistral = "mistral"
// Gemma 2B = "gemma2:2b"
  const modelOptions = [
    { label: "GPT4 MINI", value: "gpt-4o-mini" },
    { label: "GPT4", value: "gpt-4o" },
    { label: "Llamma 3.2 ", value: "llama3.2" },
    { label: "Phi 3", value: "phi3" },
    { label: "Mistral", value: "mistral" },
    { label: "Gemma 2B", value: "gemma2:2b" },
  ];

  useClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  const handleModelSelect = (model: string,label:string) => {
    console.log('handleModelSelect',model)
    setSelectedModel(model);
  setSelectedModelLabel(label)
    setIsDropdownOpen(false);
    console.log(selectedModel,'selectedModel',model)
    // Add logic to save the selected model if needed
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6" />
            <span className="text-xl font-semibold">SLAinsights</span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 hover:bg-purple-600 rounded-md px-3 py-2"
            >
              <User className="w-5 h-5" />
              <span>{user}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-6">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full md:w-80 px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between shadow-sm"
            >
              <span className="text-gray-700">Model : {selectedModelLabel || "Generative AI"}</span>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="py-1">
                  {modelOptions.map((option) => (
                    <button 
                      key={option.value}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      onClick={() => handleModelSelect(option.value,option.label)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <FileUpload />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DocumentList />
            <DocumentViewer />
          </div>
        </div>
      </main>
      <Chatbot userAvatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
    </div>
  );
}
