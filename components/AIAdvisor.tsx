
import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, BrainCircuit, Mic, Image as ImageIcon, 
  RefreshCcw, Bot, User, Volume2, Globe
} from 'lucide-react';
import { Product, Sale, Expense, BusinessSettings } from '../types';
import { getFastBusinessAdvice, getDeepBusinessAnalysis, getMarketSearch, generateProductImage } from '../services/geminiService';

interface AIAdvisorProps {
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  settings: BusinessSettings;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ products, sales, expenses, settings }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string; type?: 'text' | 'image' | 'analysis' | 'search' }[]>([
    { role: 'ai', content: "Hello! I'm your Omnistock AI Partner. I've analyzed your current data. Profits are up 12% this week, but almond milk stock is critical. How can I assist you today?", type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'standard' | 'deep' | 'market'>('standard');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let response = '';
      let type: any = 'text';

      if (mode === 'deep') {
        response = await getDeepBusinessAnalysis(userMessage);
        type = 'analysis';
      } else if (mode === 'market') {
        const res = await getMarketSearch(userMessage);
        response = res.text;
        type = 'search';
      } else {
        response = await getFastBusinessAdvice(userMessage);
      }

      setMessages(prev => [...prev, { role: 'ai', content: response, type }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error. Please ensure your API key is configured correctly in Vercel settings." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReportImage = async () => {
    setIsLoading(true);
    try {
      const url = await generateProductImage("A modern professional minimalist infographic showing business growth curves and glowing charts, 4k, cinematic lighting", "16:9");
      if (url) {
        setMessages(prev => [...prev, { role: 'ai', content: url, type: 'image' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
      <div className="flex items-center justify-between px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMode('standard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800'}`}
          >
            <Sparkles size={14} /> Flash Lite
          </button>
          <button 
            onClick={() => setMode('deep')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'deep' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800'}`}
          >
            <BrainCircuit size={14} /> Thinking Mode
          </button>
          <button 
            onClick={() => setMode('market')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'market' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800'}`}
          >
            <Globe size={14} /> Search Grounding
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <RefreshCcw size={14} className="animate-spin-slow" />
          Analyzing Live Data
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 dark:bg-slate-700'}`}>
                {msg.role === 'ai' ? <Bot size={24} /> : <User size={24} />}
              </div>
              <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {msg.type === 'image' ? (
                  <img src={msg.content} className="rounded-2xl border-2 border-indigo-100 shadow-xl max-w-full" alt="Generated report" />
                ) : (
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-600' : 'bg-indigo-600 text-white shadow-lg'}`}>
                    {msg.content.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
                  </div>
                )}
                {msg.role === 'ai' && (
                  <div className="flex gap-2 text-[10px] font-bold text-slate-400">
                    <button className="hover:text-indigo-600 flex items-center gap-1"><Volume2 size={12} /> Play Audio</button>
                    <span>•</span>
                    <button className="hover:text-indigo-600">Copy Result</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
              <div className="bg-slate-100 dark:bg-slate-700 h-12 w-48 rounded-2xl"></div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <button onClick={generateReportImage} title="Generate Chart Image" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><ImageIcon size={20} /></button>
            <input 
              className="flex-1 bg-transparent border-none outline-none px-2 text-sm"
              placeholder={`Ask Gemini about your business... (${mode} mode)`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Mic size={20} /></button>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 disabled:bg-slate-300 disabled:shadow-none transition-all active:scale-90"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="flex gap-4 mt-3 px-2">
            <button onClick={() => setInput("Summarize my sales for today")} className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-wider">Today's Summary</button>
            <button onClick={() => setInput("Predict next week's inventory needs")} className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-wider">Predict Stock</button>
            <button onClick={() => setInput("What are the trending items in Tech City?")} className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-wider">Market Trends</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
