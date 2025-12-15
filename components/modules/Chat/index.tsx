import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Cpu, Sparkles, Terminal as TerminalIcon } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { TiltCard } from '../../ui/TiltCard';
import { MagneticButton } from '../../ui/MagneticButton';
import { ChatMessage } from '../../../types';

export default function ChatModule() {
  const { aiMessages, sendAiMessage, translate } = useApp();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    const msg = input;
    setInput('');
    await sendAiMessage(msg);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#89b4fa]/5 to-transparent pointer-events-none rounded-3xl" />

      <TiltCard className="flex-1 flex flex-col bg-[#1e1e2e]/90 backdrop-blur-xl border border-[#313244] rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-5 border-b border-[#313244] bg-[#181825] flex items-center justify-between z-10 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-[#1e1e2e] border border-[#313244] flex items-center justify-center shadow-[0_0_15px_rgba(137,180,250,0.1)]">
                <Bot className="text-[#89b4fa] animate-pulse" size={24} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#a6e3a1] rounded-full border-2 border-[#1e1e2e] animate-ping" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#a6e3a1] rounded-full border-2 border-[#1e1e2e]" />
            </div>
            <div>
              <h2 className="font-black text-xl text-white tracking-tight flex items-center gap-2">
                {translate('aiChat')} <span className="text-[10px] bg-[#89b4fa]/10 text-[#89b4fa] px-2 py-0.5 rounded border border-[#89b4fa]/20 font-mono tracking-widest">V2.0 ONLINE</span>
              </h2>
              <p className="text-xs text-[#a6adc8] font-mono flex items-center gap-1 opacity-70">
                <Cpu size={10} /> Neural Core: Gemini-Flash-Exp // Latency: 42ms
              </p>
            </div>
          </div>
          <Sparkles className="text-[#89b4fa]/20 animate-spin-slow" size={48} />
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          {aiMessages.map((msg: ChatMessage, idx: number) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-4 fade-in duration-500`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-lg ${msg.role === 'user' ? 'bg-[#313244] border-[#45475a]' : 'bg-[#1e1e2e] border-[#89b4fa]/30 text-[#89b4fa]'}`}>
                {msg.role === 'user' ? <User size={18} /> : <TerminalIcon size={18} />}
              </div>
              <div className={`
                p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-xl backdrop-blur-md relative overflow-hidden group font-mono
                ${msg.role === 'user' 
                  ? 'bg-gradient-to-br from-[#89b4fa] to-[#74c7ec] text-[#1e1e2e] rounded-tr-sm font-bold' 
                  : 'bg-[#1e1e2e]/90 text-[#cdd6f4] border border-[#313244] rounded-tl-sm'
                }
              `}>
                {msg.role !== 'user' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#89b4fa]/5 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />}
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-[#1e1e2e] border border-[#89b4fa]/30 text-[#89b4fa] flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="bg-[#1e1e2e]/50 p-4 rounded-2xl border border-[#313244] rounded-tl-sm flex items-center gap-2">
                <span className="text-xs text-[#89b4fa] font-mono uppercase tracking-wider">Processing Neural Data</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#89b4fa] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-[#89b4fa] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-[#89b4fa] rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-[#181825] border-t border-[#313244] flex gap-4 z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={translate('typeMessage')}
            className="flex-1 bg-[#1e1e2e] text-white rounded-xl px-5 py-4 outline-none border border-[#313244] focus:border-[#89b4fa] focus:shadow-[0_0_15px_rgba(137,180,250,0.1)] transition-all placeholder-[#585b70] font-mono text-sm"
          />
          <MagneticButton 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-[#89b4fa] text-[#1e1e2e] p-4 rounded-xl hover:bg-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_0_20px_rgba(137,180,250,0.4)]"
          >
            <Send size={20} />
          </MagneticButton>
        </div>
      </TiltCard>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}