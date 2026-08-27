import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, ShieldCheck, ChevronDown, ExternalLink } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIChatbotProps {
  onNavigate: (view: string) => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Mabuhay! Welcome to Artisan Haven. I'm your AI Concierge. How can I help you discover handcrafted leather goods, explain GCash payments via PayMongo, or assist you with seller registration?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeEngine, setActiveEngine] = useState<'gemini' | 'voiceflow'>('gemini');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "Thank you for asking! Let me know if you need any additional styling or craftsmanship details.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: "Artisan Haven hand-crafts minimalist leather accessories in the Philippines. We accept GCash via PayMongo and ship nationwide!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "How does GCash payment work via PayMongo?",
    "How can I register as a leathercraft seller?",
    "How to care for vegetable-tanned leather?",
    "What are the delivery timelines in the Philippines?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 text-left">
      {/* Floating Circular Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-[#1C1917] hover:bg-[#92400E] text-white shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 border border-amber-500/40 cursor-pointer group"
          aria-label="Open AI Chatbot"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1C1917]" />
          </div>
          <span className="font-semibold text-xs pr-1 hidden sm:inline">
            Artisan Concierge
          </span>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E7E2D9] flex flex-col justify-between overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="bg-[#1C1917] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-600/30 border border-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-serif-display font-bold text-sm leading-none text-white">
                  Artisan Haven Concierge
                </h3>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  ● Powered by Gemini 3.7 & Voiceflow
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Engine Selector Toggle Bar */}
          <div className="bg-stone-100 px-4 py-1.5 border-b border-stone-200 flex items-center justify-between text-[11px]">
            <span className="text-stone-500 font-medium">Assistant Mode:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveEngine('gemini')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  activeEngine === 'gemini' ? 'bg-[#92400E] text-white' : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                Gemini AI
              </button>
              <button
                onClick={() => setActiveEngine('voiceflow')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  activeEngine === 'voiceflow' ? 'bg-[#92400E] text-white' : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                Voiceflow Ready
              </button>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1C1917] text-white rounded-tr-none'
                      : 'bg-white text-stone-800 border border-[#E7E2D9] rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className={`block text-[9px] mt-1 ${msg.sender === 'user' ? 'text-stone-400 text-right' : 'text-stone-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-stone-400 text-xs">
                <Bot className="w-4 h-4 text-amber-600 animate-spin" />
                <span className="italic text-[11px]">Artisan AI is composing response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Carousel */}
          <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="text-[10px] bg-white border border-stone-200 text-stone-700 px-2.5 py-1 rounded-full hover:bg-amber-50 hover:border-amber-300 hover:text-[#92400E] shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-[#E7E2D9]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about leather, GCash, or selling..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2 bg-[#92400E] hover:bg-[#78350F] text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};
