import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface ChatbotProps {
  history: ChatMessage[];
  onSendMessage: (message: string, base64Image?: string) => void;
  isLoading: boolean;
}

export default function Chatbot({ history, onSendMessage, isLoading }: ChatbotProps) {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || selectedImage) && !isLoading) {
      onSendMessage(input, selectedImage || undefined);
      setInput('');
      setSelectedImage(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">Inventory Assistant</h3>
          <p className="text-blue-100 text-[10px] uppercase tracking-widest">Powered by Gemini</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {history.length === 0 && (
          <div className="text-center py-10">
            <Bot className="mx-auto text-slate-300 mb-2" size={48} />
            <p className="text-slate-400 text-sm">How can I help you with your inventory today?</p>
          </div>
        )}
        {history.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
            }`}>
              <div className="markdown-body">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              <span className={`text-[8px] mt-1 block opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex items-center gap-2">
              <Loader2 className="animate-spin text-blue-600" size={16} />
              <span className="text-xs text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative mb-2 inline-block"
            >
              <img src={selectedImage} alt="Selected" className="h-20 w-20 object-cover rounded-lg border border-slate-200" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ImageIcon size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
            accept="image/*" 
          />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about stock, trends, or upload a photo..."
            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="bg-blue-600 text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
