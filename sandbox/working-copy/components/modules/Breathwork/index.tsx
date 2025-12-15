import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, Activity, Zap } from 'lucide-react';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

export default function BreathworkModule() {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Idle'>('Idle');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // 4-7-8 Breathing Technique
  useEffect(() => {
    if (!isActive) return;

    let cycle = 0;
    const runCycle = () => {
      setPhase('Inhale'); setTimeLeft(4);
      setTimeout(() => {
        setPhase('Hold'); setTimeLeft(7);
        setTimeout(() => {
          setPhase('Exhale'); setTimeLeft(8);
          setTimeout(() => {
            if (isActive) runCycle();
          }, 8000);
        }, 7000);
      }, 4000);
    };

    runCycle();
    return () => { setPhase('Idle'); setTimeLeft(0); };
  }, [isActive]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && isActive) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isActive]);

  return (
    <div className="h-full flex flex-col items-center justify-center animate-fade-in space-y-12 pb-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#313244] border border-[#45475a] text-xs font-bold text-[#89b4fa] uppercase tracking-widest mb-2">
            <Activity size={12} className={isActive ? "animate-pulse" : ""} /> {isActive ? "Regulation Active" : "System Ready"}
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-xl">Bio-Sync Protocol</h1>
        <p className="text-[#a6adc8]">Nervous System Regulation (4-7-8)</p>
      </div>

      <TiltCard className="relative w-[450px] h-[450px] flex items-center justify-center bg-[#1e1e2e]/50 rounded-full backdrop-blur-md border border-[#313244] shadow-2xl group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 rounded-full" />
        
        {/* Breathing Sphere Visualizer */}
        <div 
          className={`absolute rounded-full bg-gradient-to-br from-[#89b4fa] to-[#a6e3a1] transition-all ease-in-out blur-[100px] opacity-20
            ${phase === 'Inhale' ? 'w-full h-full duration-[4000ms] opacity-40' : ''}
            ${phase === 'Hold' ? 'w-full h-full duration-0 opacity-60' : ''}
            ${phase === 'Exhale' ? 'w-32 h-32 duration-[8000ms]' : ''}
            ${phase === 'Idle' ? 'w-48 h-48 opacity-10' : ''}
          `}
        />
        
        {/* Main 3D Sphere */}
        <div 
          className={`absolute rounded-full border-[6px] transition-all ease-in-out flex items-center justify-center z-10 shadow-[0_0_80px_rgba(137,180,250,0.3)]
            ${phase === 'Inhale' ? 'w-96 h-96 duration-[4000ms] border-[#89b4fa] bg-[#89b4fa]/10 scale-110' : ''}
            ${phase === 'Hold' ? 'w-96 h-96 duration-0 border-[#a6e3a1] bg-[#a6e3a1]/20 scale-110' : ''}
            ${phase === 'Exhale' ? 'w-40 h-40 duration-[8000ms] border-[#89b4fa] bg-[#1e1e2e]' : ''}
            ${phase === 'Idle' ? 'w-56 h-56 border-[#313244] bg-[#1e1e2e]' : ''}
          `}
        >
          <div className="text-center relative z-20">
            <div className={`text-4xl font-black uppercase tracking-widest mb-2 transition-colors duration-500 ${
                phase === 'Hold' ? 'text-[#a6e3a1] drop-shadow-[0_0_10px_#a6e3a1]' : phase === 'Idle' ? 'text-[#585b70]' : 'text-white'
            }`}>{phase}</div>
            
            {phase !== 'Idle' ? (
                <div className="text-7xl font-mono font-bold text-white drop-shadow-2xl">{timeLeft}s</div>
            ) : (
                <Wind size={48} className="text-[#313244] mx-auto animate-pulse" />
            )}
          </div>
        </div>
        
        {/* Ripple Effects for Hold Phase */}
        {phase === 'Hold' && (
          <>
            <div className="absolute w-full h-full border border-[#a6e3a1]/30 rounded-full animate-ping" />
            <div className="absolute w-2/3 h-2/3 border border-[#a6e3a1]/20 rounded-full animate-ping [animation-delay:0.5s]" />
          </>
        )}
      </TiltCard>

      <MagneticButton 
        onClick={() => setIsActive(!isActive)}
        className={`px-12 py-6 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center gap-3 ${
            isActive 
            ? 'bg-[#313244] text-white hover:bg-[#f38ba8] hover:text-[#1e1e2e] border border-[#f38ba8]/30' 
            : 'bg-[#89b4fa] text-[#1e1e2e] hover:bg-white border border-transparent hover:scale-105'
        }`}
      >
        {isActive ? <><Pause size={28} /> TERMINATE SYNC</> : <><Play size={28} /> INITIALIZE SEQUENCE</>}
      </MagneticButton>
    </div>
  );
}