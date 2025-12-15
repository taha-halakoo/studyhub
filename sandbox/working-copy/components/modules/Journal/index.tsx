import React, { useState } from 'react';
import { PenTool, Calendar, Smile, Meh, Frown, ThumbsUp, ThumbsDown, Book, Save, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

const MOODS = [
  { label: 'Great', icon: ThumbsUp, color: '#a6e3a1' },
  { label: 'Good', icon: Smile, color: '#89b4fa' },
  { label: 'Neutral', icon: Meh, color: '#f9e2af' },
  { label: 'Bad', icon: Frown, color: '#fab387' },
  { label: 'Awful', icon: ThumbsDown, color: '#f38ba8' },
];

// --- 3D PARTICLE CONFETTI ---
const ParticleExplosion = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {[...Array(30)].map((_, i) => (
                <div 
                    key={i} 
                    className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-[#89b4fa] to-[#a6e3a1] shadow-[0_0_10px_currentColor] animate-[explode_1.5s_ease-out_forwards]"
                    style={{
                        left: '50%', 
                        top: '50%',
                        '--rot': `${i * 12}deg`,
                        '--dist': `${Math.random() * 300 + 50}px`,
                        animationDelay: `${Math.random() * 0.1}s`
                    } as any}
                />
            ))}
            <style>{`
                @keyframes explode {
                    0% { transform: rotate(var(--rot)) translate(0, 0) scale(1); opacity: 1; }
                    100% { transform: rotate(var(--rot)) translate(var(--dist), 0) scale(0); opacity: 0; }
                }
            `}</style>
        </div>
    )
}

export default function JournalModule() {
  const { journalEntries, saveJournalEntry } = useApp();
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('Neutral');
  const [isSaving, setIsSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const hasEntryToday = journalEntries.some(e => e.date === today);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSaving(true);
    await saveJournalEntry(content, selectedMood);
    setShowConfetti(true);
    setTimeout(() => {
        setContent('');
        setIsSaving(false);
        setShowConfetti(false);
    }, 2500); 
  };

  return (
    <div className="h-full flex gap-8 animate-fade-in pb-6 perspective-1000">
      
      {/* EDITOR SECTION */}
      <div className="flex-1 flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Captain's Log <span className="text-xs bg-[#f9e2af]/10 text-[#f9e2af] px-2 py-1 rounded border border-[#f9e2af]/20 font-mono tracking-widest">PERSONAL</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Daily reflection and mental state analysis.</p>
        </div>

        {hasEntryToday && !showConfetti ? (
          <TiltCard className="flex-1 bg-[#252535]/80 backdrop-blur-md border border-[#a6e3a1]/30 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#a6e3a1]/5 pointer-events-none" />
            <div className="w-32 h-32 bg-[#a6e3a1]/20 rounded-full flex items-center justify-center text-[#a6e3a1] mb-8 shadow-[0_0_40px_rgba(166,227,161,0.2)] animate-[bounce_2s_infinite]">
                <Check size={64} strokeWidth={4} />
            </div>
            <h3 className="text-3xl font-black text-white mb-2">Entry Logged</h3>
            <p className="text-[#a6adc8] max-w-sm leading-relaxed mb-6">Your reflection for today has been encrypted and stored in the vault.</p>
            <div className="text-sm font-bold text-[#a6e3a1] border border-[#a6e3a1]/30 px-4 py-2 rounded-full animate-pulse">
                See you tomorrow, Engineer.
            </div>
          </TiltCard>
        ) : (
          <TiltCard className="bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl p-8 shadow-2xl flex-1 flex flex-col relative overflow-hidden transform-style-3d">
            {showConfetti && <ParticleExplosion />}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f9e2af] via-[#fab387] to-[#f38ba8] opacity-30" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="text-sm font-mono text-[#89b4fa] bg-[#1e1e2e] px-3 py-1 rounded-lg border border-[#313244] shadow-inner">
                {new Date().toDateString()}
              </div>
              
              {/* 3D Mood Orbs */}
              <div className="flex bg-[#1e1e2e] rounded-xl p-1.5 border border-[#313244] shadow-inner">
                {MOODS.map((mood, i) => (
                  <button
                    key={mood.label}
                    onClick={() => setSelectedMood(mood.label)}
                    className={`p-3 rounded-lg transition-all relative group hover:-translate-y-1 duration-300 ${selectedMood === mood.label ? 'bg-[#313244] shadow-lg scale-110 z-10' : 'hover:bg-[#313244]/50'}`}
                    title={mood.label}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <div className={`transition-transform duration-300 ${selectedMood === mood.label ? 'scale-125' : ''}`}>
                        <mood.icon size={22} color={selectedMood === mood.label ? mood.color : '#585b70'} />
                    </div>
                    {selectedMood === mood.label && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full blur-[4px]" style={{ backgroundColor: mood.color }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Paper Texture Area */}
            <div className="flex-1 relative z-10 group">
                <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did you learn today? How is your energy level? Reflect on your progress..."
                className="w-full h-full bg-[#1e1e2e] p-8 rounded-2xl text-white outline-none resize-none border border-[#313244] focus:border-[#89b4fa] transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] text-lg leading-relaxed placeholder-[#585b70]"
                />
                <div className="absolute bottom-4 right-4 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                    <PenTool size={24} className="text-[#313244]" />
                </div>
            </div>
            
            <div className="flex justify-end mt-6 relative z-10">
              <MagneticButton 
                onClick={handleSubmit} 
                disabled={!content.trim() || isSaving} 
                className="bg-gradient-to-r from-[#89b4fa] to-[#b4befe] text-[#1e1e2e] font-black px-10 py-4 rounded-xl hover:scale-105 shadow-[0_0_30px_rgba(137,180,250,0.4)] transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isSaving ? <div className="w-5 h-5 border-3 border-[#1e1e2e] border-t-transparent rounded-full animate-spin" /> : <Save size={20} />} 
                {isSaving ? "ENCRYPTING..." : "SAVE ENTRY (+30 XP)"}
              </MagneticButton>
            </div>
          </TiltCard>
        )}
      </div>

      {/* HISTORY SIDEBAR */}
      <TiltCard className="w-96 flex flex-col bg-[#252535]/80 backdrop-blur-xl border border-[#313244] rounded-3xl overflow-hidden shadow-2xl relative h-full">
        <div className="p-6 border-b border-[#313244] bg-[#1e1e2e]/50 z-10 flex justify-between items-center">
            <h2 className="font-black text-white flex items-center gap-2 text-xl">
                <Book size={24} className="text-[#a6adc8]" /> History Log
            </h2>
            <div className="w-2 h-2 rounded-full bg-[#a6adc8] animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar z-10">
          {journalEntries.map((entry, idx) => {
            const moodConfig = MOODS.find(m => m.label === entry.mood) || MOODS[2];
            const MoodIcon = moodConfig.icon;
            return (
              <div 
                key={entry.id} 
                className="bg-[#1e1e2e] p-5 rounded-2xl border border-[#313244] hover:border-[#89b4fa]/50 transition-all group hover:scale-[1.02] cursor-default shadow-md hover:shadow-xl relative overflow-hidden animate-in slide-in-from-right duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`absolute top-0 left-0 w-1 h-full`} style={{ backgroundColor: moodConfig.color }} />
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] text-[#585b70] font-mono bg-[#252535] px-2 py-1 rounded border border-[#313244]">{entry.date}</span>
                  <div className="p-1 rounded-full bg-[#252535]">
                    <MoodIcon size={14} color={moodConfig.color} />
                  </div>
                </div>
                <p className="text-sm text-[#cdd6f4] line-clamp-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{entry.content}</p>
              </div>
            );
          })}
          {journalEntries.length === 0 && (
            <div className="text-center text-[#585b70] text-sm py-20 flex flex-col items-center">
                <Book size={48} className="opacity-20 mb-4" />
                No logs recorded.
            </div>
          )}
        </div>
      </TiltCard>
    </div>
  );
}