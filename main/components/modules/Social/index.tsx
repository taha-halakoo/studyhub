import React, { useState, useEffect, useRef } from 'react';
import { Users, Radio, Globe, Send, User, MessageSquare, Hash } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { TiltCard } from '../../ui/TiltCard';
import { MagneticButton } from '../../ui/MagneticButton';

export default function SocialModule() {
  const { socialMessages, sendSocialMessage, user, profile, translate } = useApp();
  const [input, setInput] = useState('');
  const [activeChannel, setActiveChannel] = useState('global');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [socialMessages, activeChannel]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendSocialMessage(input, activeChannel);
    setInput('');
  };

  const channels = Array.from(new Set(socialMessages.map(m => m.channel || 'global')));
  if (!channels.includes('global')) channels.unshift('global');

  const filteredMessages = socialMessages.filter(m => (m.channel || 'global') === activeChannel);

  return (
    <div className="h-full flex flex-col animate-fade-in pb-6 gap-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Social Hub <span className="text-xs bg-[#a6e3a1]/10 text-[#a6e3a1] px-2 py-1 rounded border border-[#a6e3a1]/20 font-mono tracking-widest">NETWORK</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Global neural link & community frequency.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        
        {/* ROOMS LIST */}
        <TiltCard className="lg:col-span-1 bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl p-6 shadow-2xl flex flex-col h-full">
          <h3 className="font-black text-white mb-4 flex items-center gap-2">
            <Radio size={20} className="text-[#89b4fa] animate-pulse" /> Frequencies
          </h3>
          <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
            {channels.map(channel => (
              <div 
                key={channel}
                onClick={() => setActiveChannel(channel)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all group ${
                  activeChannel === channel 
                    ? 'bg-[#1e1e2e] border-[#89b4fa] shadow-[0_0_15px_rgba(137,180,250,0.1)]' 
                    : 'bg-[#1e1e2e]/50 border-[#313244] hover:border-[#89b4fa]/50'
                }`}
              >
                <h3 className={`font-bold flex items-center gap-2 transition-colors ${
                  activeChannel === channel ? 'text-white' : 'text-[#a6adc8] group-hover:text-white'
                }`}>
                  {channel === 'global' ? <Globe size={16} /> : <Hash size={16} />} 
                  {channel === 'global' ? 'Global Chat' : channel}
                </h3>
                <p className="text-xs text-[#585b70] mt-1 line-clamp-1">
                  {socialMessages.filter(m => (m.channel || 'global') === channel).length} messages
                </p>
              </div>
            ))}
          </div>
        </TiltCard>

        {/* CHAT AREA */}
        <TiltCard className="lg:col-span-3 bg-[#1e1e2e]/90 backdrop-blur-xl border border-[#313244] rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#89b4fa] via-[#a6e3a1] to-[#89b4fa] opacity-30" />
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
            {filteredMessages.map((msg, idx) => {
              const isMe = msg.user_id === user?.id;
              return (
                <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-lg ${isMe ? 'bg-[#89b4fa] border-[#89b4fa] text-[#1e1e2e]' : 'bg-[#252535] border-[#313244] text-[#a6adc8]'}`}>
                    <User size={18} />
                  </div>
                  <div className={`max-w-[70%]`}>
                    <div className={`text-[10px] text-[#585b70] mb-1 font-bold ${isMe ? 'text-right' : ''}`}>@{msg.username}</div>
                    <div className={`p-4 rounded-2xl text-sm shadow-md leading-relaxed ${isMe ? 'bg-[#89b4fa]/20 text-white border border-[#89b4fa]/30 rounded-tr-none' : 'bg-[#252535] text-[#cdd6f4] border border-[#313244] rounded-tl-none'}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="p-5 bg-[#252535] border-t border-[#313244] flex gap-4 z-10">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Broadcast to ${activeChannel}...`}
              className="flex-1 bg-[#1e1e2e] text-white rounded-xl px-5 py-4 outline-none border border-[#313244] focus:border-[#89b4fa] transition-all placeholder-[#585b70]"
            />
            <MagneticButton onClick={handleSend} className="bg-[#89b4fa] text-[#1e1e2e] p-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(137,180,250,0.4)]">
              <Send size={20} />
            </MagneticButton>
          </div>
        </TiltCard>

      </div>
    </div>
  );
}