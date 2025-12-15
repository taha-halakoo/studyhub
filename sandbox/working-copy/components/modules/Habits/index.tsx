import React, { useState } from 'react';
import { Plus, Flame, Check, Trash2, Calendar, Activity, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

const DAYS = 365;

export default function HabitsModule() {
  const { habits, addHabit, toggleHabit, deleteHabit } = useApp();
  const [newHabit, setNewHabit] = useState('');

  const handleAdd = async () => {
    if (!newHabit.trim()) return;
    await addHabit(newHabit);
    setNewHabit('');
  };

  const today = new Date().toISOString().split('T')[0];

  const getHeatmapDates = () => {
    const dates = [];
    for (let i = DAYS; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };
  const heatmapDates = getHeatmapDates();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Habit Matrix <span className="text-xs bg-[#a6e3a1]/10 text-[#a6e3a1] px-2 py-1 rounded border border-[#a6e3a1]/20 font-mono tracking-widest">CONSISTENCY</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Behavioral reinforcement and tracking.</p>
        </div>
      </div>

      {/* NEW HABIT INPUT */}
      <TiltCard className="bg-[#252535] p-4 rounded-3xl border border-[#313244] shadow-xl flex gap-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#a6e3a1] to-[#89b4fa]" />
        <div className="absolute inset-0 bg-[#89b4fa]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <input 
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Define new habit protocol..."
          className="flex-1 bg-[#1e1e2e] border border-[#313244] rounded-2xl px-6 py-4 text-white outline-none focus:border-[#89b4fa] transition-all placeholder-[#585b70] shadow-inner relative z-10"
        />
        <MagneticButton onClick={handleAdd} className="bg-[#89b4fa] text-[#1e1e2e] font-bold px-8 rounded-2xl hover:bg-white transition-all shadow-[0_0_20px_rgba(137,180,250,0.3)] relative z-10">
          <Plus size={24} />
        </MagneticButton>
      </TiltCard>

      {/* HABIT CARDS */}
      <div className="grid gap-6">
        {habits.map(habit => {
          const isDoneToday = habit.completed_dates.includes(today);

          return (
            <TiltCard key={habit.id} className="bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl p-6 shadow-lg group hover:border-[#a6e3a1]/30 transition-all overflow-hidden relative">
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-5">
                  <MagneticButton 
                    onClick={() => toggleHabit(habit.id, today)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2
                        ${isDoneToday 
                            ? 'bg-[#a6e3a1] text-[#1e1e2e] border-[#a6e3a1] shadow-[0_0_20px_rgba(166,227,161,0.4)] scale-105' 
                            : 'bg-[#1e1e2e] border-[#313244] text-[#313244] hover:border-[#a6e3a1] hover:text-[#a6e3a1]'
                        }
                    `}
                  >
                    <Check size={28} strokeWidth={3} />
                  </MagneticButton>
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        {habit.title}
                        {isDoneToday && <Zap size={16} className="text-[#a6e3a1] fill-current animate-bounce" />}
                    </h3>
                    <div className="flex items-center gap-2 text-[#f9e2af] text-sm font-bold mt-1 bg-[#f9e2af]/10 w-fit px-3 py-1 rounded-full border border-[#f9e2af]/20 shadow-[0_0_10px_rgba(249,226,175,0.1)]">
                      <Flame size={14} fill="currentColor" className="animate-pulse" />
                      {habit.streak} Day Streak
                    </div>
                  </div>
                </div>
                <MagneticButton onClick={() => deleteHabit(habit.id)} className="text-[#f38ba8] opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#f38ba8]/10 rounded-xl">
                  <Trash2 size={20} />
                </MagneticButton>
              </div>

              {/* FIXED HEATMAP (Preventing infinite expansion) */}
              <div className="w-full overflow-x-auto custom-scrollbar pb-2 pt-2 border-t border-[#313244] max-w-full">
                <div className="flex gap-1 min-w-max">
                  {heatmapDates.map((date) => {
                    const active = habit.completed_dates.includes(date);
                    return (
                      <div 
                        key={date}
                        title={date}
                        className={`w-3 h-3 rounded-sm transition-all duration-500 ${active ? 'bg-[#89b4fa] shadow-[0_0_5px_#89b4fa] scale-110' : 'bg-[#1e1e2e]'}`}
                      />
                    );
                  })}
                </div>
              </div>
            </TiltCard>
          );
        })}

        {habits.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-[#313244] rounded-3xl group hover:border-[#a6e3a1]/30 transition-colors">
            <div className="p-6 bg-[#1e1e2e] rounded-full inline-block mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Activity size={48} className="text-[#313244] group-hover:text-[#a6e3a1] transition-colors" />
            </div>
            <h3 className="text-[#a6adc8] font-bold text-lg">No Habits Defined</h3>
            <p className="text-[#585b70]">Initialize a routine to generate consistency data.</p>
          </div>
        )}
      </div>
    </div>
  );
}