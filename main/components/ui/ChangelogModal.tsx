import React, { useEffect, useRef } from 'react';
import { X, GitCommit } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UPDATES = [
  { ver: 'v20.0', title: 'System Launch', desc: 'Onboarding, Changelog, Offline Mode, Sync Status.' },
  { ver: 'v19.0', title: 'Academic Core', desc: 'Gradebook, GPA Calculator, Semesters.' },
  { ver: 'v18.0', title: 'Academic Shield', desc: 'Exam Mode, Flashcard Decks, Shortcuts.' },
  { ver: 'v17.0', title: 'Time Master', desc: 'Weekly Scheduler, Routine Manager.' },
  { ver: 'v16.0', title: 'Scholar Archive', desc: 'Bibliography, Split-Screen Reader.' },
  { ver: 'v15.0', title: 'Gamified Horizon', desc: 'Boss Battles, Notification Center.' },
  { ver: 'v14.0', title: 'Architect Blueprint', desc: 'Projects, Note Templates.' },
  { ver: 'v13.0', title: 'Creative Suite', desc: 'Theme Studio, Canvas Gallery.' },
  { ver: 'v12.0', title: 'Hyper-Connector', desc: 'Code Lab, Global News, Sonic Layer.' },
];

export const ChangelogModal = ({ isOpen, onClose }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      modalRef.current?.focus(); // Simple focus management
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="changelog-title"
    >
      <div 
        ref={modalRef}
        className="bg-[#1e1e2e] w-full max-w-md rounded-2xl border border-[#313244] shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]" 
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="p-4 border-b border-[#313244] flex justify-between items-center bg-[#252535]">
          <h2 id="changelog-title" className="text-lg font-bold text-white flex items-center gap-2">
            <GitCommit className="text-[#a6e3a1]" /> System Changelog
          </h2>
          <button onClick={onClose} className="text-[#a6adc8] hover:text-white" aria-label="Close Changelog"><X /></button>
        </div>
        
        <div className="p-4 overflow-y-auto custom-scrollbar space-y-4">
          {UPDATES.map((u, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-[#89b4fa]" />
                {i !== UPDATES.length - 1 && <div className="w-px h-full bg-[#313244] my-1" />}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#89b4fa] bg-[#89b4fa]/10 px-2 rounded">{u.ver}</span>
                  <span className="font-bold text-white text-sm">{u.title}</span>
                </div>
                <p className="text-xs text-[#a6adc8] leading-relaxed">{u.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};