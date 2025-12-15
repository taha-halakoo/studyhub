import React from 'react';
import { Zap, Activity, Mic, Palette, Lock, Sword } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { TiltCard } from '../../ui/TiltCard';
import { Skill } from '../../../types';

export default function SkillsModule() {
  const { skills } = useApp();

  const getIcon = (id: string) => {
    switch(id) {
      case 'int': return <Zap size={32} />;
      case 'vit': return <Activity size={32} />;
      case 'chr': return <Mic size={32} />;
      case 'dex': return <Palette size={32} />;
      default: return <Sword size={32} />;
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#89b4fa]/10 text-[#89b4fa] text-xs font-black uppercase tracking-[0.2em] border border-[#89b4fa]/20 shadow-[0_0_20px_rgba(137,180,250,0.2)]">
            <Sword size={14} /> Progression Matrix
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">Neural Skill Tree</h1>
        <p className="text-[#a6adc8]">Character development & mastery tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {skills.map((skill: Skill, index: number) => {
          const nextLevelXp = skill.level * 1000;
          const progress = Math.min((skill.xp / nextLevelXp) * 100, 100);

          return (
            <TiltCard 
                key={skill.id} 
                className="bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 h-[400px] flex flex-col justify-between"
            >
              <div 
                className="absolute inset-0 opacity-10 transition-transform duration-700 group-hover:scale-150 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${skill.color}, transparent 70%)` }}
              />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div 
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl text-[#1e1e2e] group-hover:rotate-12 transition-transform duration-500 border-4 border-[#1e1e2e]"
                  style={{ backgroundColor: skill.color }}
                >
                  {getIcon(skill.id)}
                </div>

                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{skill.name}</h2>
                <div className="text-sm font-bold text-[#a6adc8] uppercase tracking-widest mb-8 bg-[#1e1e2e] px-3 py-1 rounded-full border border-[#313244]">Level {skill.level}</div>

                <div className="w-full h-3 bg-[#1e1e2e] rounded-full overflow-hidden mb-3 border border-[#313244]">
                  <div 
                    className="h-full transition-all duration-1000 relative"
                    style={{ width: `${progress}%`, backgroundColor: skill.color }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
                <div className="flex justify-between w-full text-[10px] font-mono text-[#585b70] uppercase font-bold">
                  <span>{skill.xp} XP</span>
                  <span>{nextLevelXp} XP</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2 relative z-10">
                {skill.linked_tags.map((tag: string) => (
                  <span key={tag} className="text-[10px] bg-[#1e1e2e]/80 border border-[#313244] px-2 py-1 rounded text-[#a6adc8] backdrop-blur-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Locked Section */}
      <div className="opacity-50 pointer-events-none grayscale relative mt-12">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="bg-[#1e1e2e] px-8 py-4 rounded-2xl border border-[#313244] shadow-2xl flex items-center gap-3">
                <Lock size={20} className="text-[#585b70]" />
                <span className="font-bold text-[#a6adc8] uppercase tracking-widest text-sm">Advanced Protocols Locked</span>
            </div>
        </div>
        <h3 className="text-center text-[#585b70] font-bold mb-8 uppercase tracking-[0.5em] text-xs">Future Expansions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 blur-sm">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#1e1e2e] border-2 border-dashed border-[#313244] rounded-3xl p-8 flex flex-col items-center justify-center gap-4 h-64">
              <div className="p-4 bg-[#252535] rounded-full"><Lock size={32} className="text-[#585b70]" /></div>
              <div className="text-[#585b70] font-bold">Classified</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}