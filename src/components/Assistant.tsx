import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  Trash2, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSafetyAdvice } from '../services/aiAssistantService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: "Hello. I am PhishGuard AI. I specialized in E-banking security and phishing detection strategies. How can I assist you in securing your digital assets today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const aiResponse = await getSafetyAdvice(input, history);
      const modelMessage: Message = { id: (Date.now() + 1).toString(), role: 'model', text: aiResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: "I encountered an error processing your request. Please ensure the system's AI core is active." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-[#121214] border border-white/10 rounded-2xl overflow-hidden shadow-2xl mb-12"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-black/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Bot size={20} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest font-mono">PhishGuard_Assistant.exe</h2>
            <p className="text-[10px] text-white/40 uppercase font-mono">Neural Safety Interface</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-white/20 hover:text-red-500"
          title="Reset Core"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.03),transparent)]">
        {messages.map((m) => (
          <div 
            key={m.id}
            className={cn(
              "flex gap-3 max-w-[85%]",
              m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
              m.role === 'user' ? "bg-white/5 border-white/10" : "bg-green-500/10 border-green-500/30"
            )}>
              {m.role === 'user' ? <User size={14} className="text-white/40" /> : <Bot size={14} className="text-green-500" />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed font-mono",
              m.role === 'user' ? "bg-white/5 text-white/80 rounded-tr-none" : "bg-black/40 text-green-500/90 rounded-tl-none border border-white/5"
            )}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-green-500/10 border-green-500/30">
              <Loader2 size={14} className="text-green-500 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl text-sm leading-relaxed font-mono bg-black/40 text-green-500/50 animate-pulse italic">
              Accessing knowledge base...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/30">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about phishing patterns or security advice..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-green-500 transition-all font-mono"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-green-500 text-black hover:bg-green-400 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-white/20 mt-2 text-center uppercase tracking-widest font-mono">
          Security Core // Model: Gemini-1.5-Flash
        </p>
      </form>
    </motion.div>
  );
};

export default Assistant;
