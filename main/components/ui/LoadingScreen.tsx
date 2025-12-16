import React from 'react';

export const LoadingScreen = ({ logs }: { logs?: string[] }) => {
  return (
    <div className="fixed inset-0 bg-[#1e1e2e] z-50 flex flex-col items-center justify-center p-8">
      <div className="relative w-24 h-24 mb-8">
        {/* Glowing Heart Path */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full drop-shadow-[0_0_15px_#f38ba8]"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="none"
            stroke="#f38ba8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-heart"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-black text-white tracking-[0.3em] animate-fade-in mb-4">
        STUDYHUB
      </h2>
      
      <div className="flex items-center justify-center gap-1 mb-8">
        <div className="w-1.5 h-1.5 bg-[#89b4fa] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-[#89b4fa] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-[#89b4fa] rounded-full animate-bounce"></div>
      </div>

      {/* DEBUG LOG OUTPUT */}
      <div 
        className="w-full max-w-md bg-[#11111b] rounded-lg border border-[#313244] p-4 font-mono text-[10px] text-[#a6adc8] h-48 overflow-y-auto custom-scrollbar"
        aria-live="polite"
      >
        <div className="text-[#89b4fa] font-bold mb-2 uppercase tracking-wider border-b border-[#313244] pb-1">System Init Log</div>
        {logs && logs.length > 0 ? (
            logs.map((log, i) => (
                <div key={i} className="mb-1 border-b border-[#313244]/30 pb-0.5 last:border-0">{log}</div>
            ))
        ) : (
            <div className="animate-pulse">Waiting for system logs...</div>
        )}
      </div>
      
      <style>{`
        @keyframes draw-heart {
          0% { stroke-dasharray: 0 100; opacity: 0; fill: transparent; }
          50% { stroke-dasharray: 100 0; opacity: 1; fill: transparent; }
          100% { stroke-dasharray: 100 0; opacity: 1; fill: #f38ba8; }
        }
        .animate-draw-heart {
          animation: draw-heart 2s ease-in-out forwards alternate infinite;
        }
      `}</style>
    </div>
  );
};