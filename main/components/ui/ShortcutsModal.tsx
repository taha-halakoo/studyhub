import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'CMD/CTRL + K', desc: 'Open Oracle (Command Palette)' },
    { key: '?', desc: 'Show this Shortcuts Menu' },
    { key: 'ESC', desc: 'Close Modals' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1e1e2e] w-full max-w-lg rounded-2xl border border-[#313244] shadow-2xl relative overflow-hidden">
        <div className="p-6 border-b border-[#313244] flex justify-between items-center bg-[#252535]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Keyboard className="text-[#89b4fa]" /> Keyboard Control
          </h2>
          <button onClick={onClose} className="text-[#a6adc8] hover:text-white"><X /></button>
        </div>
        
        <div className="p-6 space-y-4">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-[#252535] rounded-lg">
              <span className="text-[#cdd6f4] text-sm">{s.desc}</span>
              <kbd className="bg-[#1e1e2e] px-3 py-1 rounded border border-[#313244] font-mono text-xs font-bold text-[#f9e2af]">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};