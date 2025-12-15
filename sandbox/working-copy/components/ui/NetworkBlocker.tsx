import React, { useState, useEffect } from 'react';
import { WifiOff, ShieldAlert } from 'lucide-react';

export const NetworkBlocker = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#1e1e2e]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
      <div className="w-32 h-32 bg-[#f38ba8]/10 rounded-full flex items-center justify-center border-4 border-[#f38ba8] mb-8 animate-pulse shadow-[0_0_50px_rgba(243,139,168,0.3)]">
        <WifiOff size={64} className="text-[#f38ba8]" />
      </div>
      
      <h1 className="text-4xl font-black text-white mb-4 tracking-tight">CONNECTION SEVERED</h1>
      
      <div className="max-w-md bg-[#252535] border border-[#f38ba8]/30 p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 text-[#f38ba8] font-bold mb-2 justify-center">
            <ShieldAlert size={20} />
            <span>SECURITY PROTOCOL ACTIVE</span>
        </div>
        <p className="text-[#a6adc8] text-sm leading-relaxed">
          The Neural Link has detected a network interruption. 
          To prevent data corruption and ensure synchronization integrity, 
          all local operations have been suspended.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs font-mono text-[#585b70] uppercase tracking-widest">
        <div className="w-2 h-2 bg-[#f38ba8] rounded-full animate-ping" />
        Waiting for Uplink...
      </div>
    </div>
  );
};