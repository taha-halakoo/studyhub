import React from 'react';
import { Target, Gift, CheckCircle, Clock, Scroll, Zap, Star } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

export default function QuestsModule() {
  const { quests, claimQuest } = useApp();

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f9e2af]/10 text-[#f9e2af] text-xs font-black uppercase tracking-[0.2em] border border-[#f9e2af]/20 shadow-[0_0_20px_rgba(249,226,175,0.2)] mb-4">
            <Scroll size={14} /> Mission Board
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">Daily Operations</h1>
        <p className="text-[#a6adc8]">Complete objectives to earn merit and reputation.</p>
      </div>

      <div className="grid gap-6">
        {quests.map(quest => {
          const isComplete = quest.progress >= quest.target;
          const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);

          return (
            <TiltCard 
              key={quest.id} 
              className={`
                relative border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between overflow-hidden transition-all group
                ${quest.is_claimed 
                    ? 'bg-[#1e1e2e]/50 border-[#313244] opacity-50 grayscale' 
                    : isComplete 
                        ? 'bg-[#252535]/90 border-[#a6e3a1] shadow-[0_0_30px_rgba(166,227,161,0.15)]' 
                        : 'bg-[#252535]/80 border-[#313244] hover:border-[#89b4fa]/50'
                }
              `}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-r from-[#a6e3a1]/20 via-transparent to-transparent opacity-0 transition-opacity duration-1000"
                style={{ width: isComplete ? '100%' : '0%', opacity: isComplete ? 1 : 0 }}
              />

              <div className="flex items-center gap-6 z-10 w-full md:w-auto">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300
                  ${isComplete ? 'bg-[#a6e3a1] text-[#1e1e2e] border-[#a6e3a1]' : 'bg-[#1e1e2e] text-[#a6adc8] border-[#313244]'}
                `}>
                  {isComplete ? <CheckCircle size={32} /> : <Target size={32} />}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-white text-lg tracking-tight mb-2">{quest.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-[#a6adc8]">
                    <div className="w-48 h-2 bg-[#1e1e2e] rounded-full overflow-hidden border border-[#313244]">
                      <div 
                        className={`h-full transition-all duration-1000 relative ${isComplete ? 'bg-[#a6e3a1]' : 'bg-[#89b4fa]'}`} 
                        style={{ width: `${progressPercent}%` }} 
                      >
                        <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">{quest.progress}/{quest.target}</span>
                  </div>
                </div>
              </div>

              <div className="z-10 flex items-center gap-6 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-[10px] text-[#a6adc8] uppercase font-bold tracking-widest mb-1">Reward</div>
                  <div className="text-[#f9e2af] font-black text-xl flex items-center gap-2 justify-end drop-shadow-sm">
                    <Gift size={18} /> {quest.reward_xp} XP
                  </div>
                </div>
                
                <MagneticButton 
                  onClick={() => claimQuest(quest.id)}
                  disabled={!isComplete || quest.is_claimed}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg
                    ${quest.is_claimed 
                        ? 'bg-transparent text-[#a6e3a1] border border-[#a6e3a1] cursor-default' 
                        : isComplete 
                            ? 'bg-[#a6e3a1] text-[#1e1e2e] hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(166,227,161,0.4)]' 
                            : 'bg-[#1e1e2e] text-[#585b70] border border-[#313244] cursor-not-allowed'
                    }
                  `}
                >
                  {quest.is_claimed ? 'Claimed' : isComplete ? 'Claim Reward' : 'In Progress'}
                </MagneticButton>
              </div>
            </TiltCard>
          );
        })}
      </div>

      <div className="flex justify-center mt-12">
        <div className="bg-[#1e1e2e] px-6 py-3 rounded-full border border-[#313244] text-xs text-[#585b70] flex items-center gap-2 font-mono uppercase tracking-widest shadow-inner">
          <Clock size={14} />
          New operations issued at 00:00 system time.
        </div>
      </div>
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}