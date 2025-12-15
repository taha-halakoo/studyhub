import React, { useState, useEffect } from 'react';
import { Timer, AlertTriangle, LogOut } from 'lucide-react';

export default function ExamModeModule() {
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 60000);
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const startExam = () => {
    setTimeLeft(duration);
    setIsActive(true);
    // Request full screen
    document.documentElement.requestFullscreen().catch(() => {});
  };

  const endExam = () => {
    setIsActive(false);
    if (document.fullscreenElement) document.exitFullscreen();
  };

  if (isActive) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#1e1e2e] flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
        <div className="w-full max-w-4xl border-4 border-[#f38ba8] rounded-2xl p-12 relative overflow-hidden bg-[#181825]">
           <div className="absolute top-0 left-0 w-full h-2 bg-[#f38ba8] animate-pulse" />
           
           <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">EXAM PROTOCOL ACTIVE</h1>
           <div className="text-9xl font-mono text-[#f38ba8] font-bold mb-12">
             {timeLeft} <span className="text-2xl text-[#a6adc8]">MINUTES REMAINING</span>
           </div>
           
           <div className="flex gap-4 justify-center">
             <button onClick={endExam} className="px-8 py-4 bg-[#313244] text-[#f38ba8] rounded-xl font-bold border border-[#f38ba8] hover:bg-[#f38ba8] hover:text-[#1e1e2e] transition-all flex items-center gap-2">
               <LogOut /> ABORT SEQUENCE
             </button>
           </div>

           <p className="mt-8 text-[#585b70] animate-pulse">DO NOT EXIT FULLSCREEN. FOCUS IS MANDATORY.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-black text-white tracking-tight">Exam Simulator</h1>
        <p className="text-[#a6adc8]">High-stakes environment replication.</p>
      </div>

      <div className="bg-[#252535] p-8 rounded-2xl border border-[#313244] w-full max-w-md shadow-2xl">
        <label className="block text-sm font-bold text-[#a6adc8] mb-4 uppercase">Duration (Minutes)</label>
        <input 
          type="number" 
          value={duration} 
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full bg-[#1e1e2e] p-4 rounded-xl text-2xl font-mono text-white border border-[#313244] outline-none focus:border-[#f38ba8] text-center mb-8"
        />
        
        <button 
          onClick={startExam}
          className="w-full py-4 bg-[#f38ba8] text-[#1e1e2e] font-black text-xl rounded-xl hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Timer /> INITIALIZE
        </button>

        <div className="mt-6 flex items-start gap-2 text-xs text-[#f38ba8] bg-[#f38ba8]/10 p-3 rounded-lg border border-[#f38ba8]/20">
          <AlertTriangle size={16} className="shrink-0" />
          <span>Warning: This will lock the interface and enable full-screen mode. All other modules will be inaccessible until the timer expires or is aborted.</span>
        </div>
      </div>
    </div>
  );
}