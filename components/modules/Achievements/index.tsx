import React from 'react';
import { Trophy, Lock, Unlock, Award, Star } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { TiltCard } from '../../ui/TiltCard';
import { Achievement } from '../../../types';

export default function AchievementsModule() {
  const { profile, achievements } = useApp();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-end border-b border-[#313244] pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            Hall of Records <span className="text-xs bg-[#f9e2af]/10 text-[#f9e2af] px-2 py-1 rounded border border-[#f9e2af]/20 font-mono tracking-widest">LEGACY</span>
          </h1>
          <p className="text-[#a6adc8] mt-2">Milestones of your engineering journey.</p>
        </div>
        <TiltCard className="px-8 py-6 bg-[#252535] rounded-3xl border border-[#313244] text-right shadow-xl">
          <div className="text-5xl font-black text-[#f9e2af] drop-shadow-lg">
            {profile?.achievements?.length || 0}<span className="text-xl text-[#585b70] font-normal">/{achievements.length}</span>
          </div>
          <div className="text-xs uppercase font-bold text-[#a6adc8] tracking-[0.3em] mt-2">Medals Awarded</div>
        </TiltCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((ach: Achievement, idx: number) => {
          const isUnlocked = profile?.achievements?.includes(ach.id);
          
          return (
            <TiltCard 
              key={ach.id} 
              className={`relative p-8 rounded-3xl border flex items-center gap-6 overflow-hidden group transition-all duration-500
                ${isUnlocked 
                  ? 'bg-[#252535]/80 backdrop-blur-md border-[#f9e2af]/30 shadow-[0_0_30px_rgba(249,226,175,0.1)]' 
                  : 'bg-[#1e1e2e] border-[#313244] opacity-60 grayscale'}
              `}
              intensity={isUnlocked ? 20 : 5}
            >
              {/* Background Glow */}
              {isUnlocked && <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#f9e2af] blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity" />}

              {/* 3D Icon Container */}
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold border-4 shrink-0 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500
                ${isUnlocked ? 'bg-[#f9e2af] text-[#1e1e2e] border-[#f9e2af]' : 'bg-[#313244] text-[#585b70] border-[#45475a]'}
              `}>
                {isUnlocked ? <Trophy size={40} /> : <Lock size={32} />}
              </div>

              <div className="relative z-10 flex-1">
                <h3 className={`text-2xl font-black mb-2 ${isUnlocked ? 'text-white' : 'text-[#a6adc8]'}`}>{ach.title}</h3>
                <p className="text-sm text-[#a6adc8] leading-relaxed">{ach.description}</p>
                {isUnlocked ? (
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#f9e2af] bg-[#f9e2af]/10 px-3 py-1.5 rounded-lg border border-[#f9e2af]/20 shadow-[0_0_10px_rgba(249,226,175,0.2)]">
                    <Star size={12} fill="currentColor" /> +{ach.xp_reward} XP EARNED
                  </div>
                ) : (
                    <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#585b70] bg-[#1e1e2e] px-3 py-1.5 rounded-lg border border-[#313244]">
                        LOCKED
                    </div>
                )}
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}