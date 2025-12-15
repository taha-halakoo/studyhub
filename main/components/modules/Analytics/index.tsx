import React from 'react';
import { BarChart3, Clock, CheckCircle, Brain, TrendingUp } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { TiltCard } from '../../ui/TiltCard';
import { JournalEntry, FocusSession, Task } from '../../../types';

// Animated SVG Line Chart
const SparkLine = ({ data, color }: { data: number[], color: string, height?: number }) => {
  const max = Math.max(...data, 1);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative h-[60px] w-full overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <defs>
                <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path 
                d={`M0,100 L0,${100 - (data[0]/max)*100} ${points.split(' ').map((p) => `L${p}`).join(' ')} L100,100 Z`} 
                fill={`url(#grad-${color})`} 
                className="opacity-50"
            />
            <polyline 
                points={points} 
                fill="none" 
                stroke={color} 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="drop-shadow-md animate-[draw_2s_ease-out_forwards]"
                strokeDasharray="300"
                strokeDashoffset="300"
            />
        </svg>
        <style>{`
            @keyframes draw { to { stroke-dashoffset: 0; } }
        `}</style>
    </div>
  );
};

export default function AnalyticsModule() {
  const { focusSessions, tasks, journalEntries } = useApp();

  // 1. Weekly Focus Calculation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const focusData = last7Days.map(date => {
    const minutes = focusSessions
      .filter((s: FocusSession) => s.completed_at.startsWith(date))
      .reduce((acc: number, curr: FocusSession) => acc + curr.duration, 0);
    return { date, minutes };
  });

  const focusValues = focusData.map(d => d.minutes);
  const maxMinutes = Math.max(...focusValues, 60);

  // 2. Task Velocity
  const completedTasks = tasks.filter((t: Task) => t.is_completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 3. Mood Analysis (Fixed Implicit Any)
  const moodCounts = journalEntries.reduce<Record<string, number>>((acc, curr: JournalEntry) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">System Analytics</h1>
          <p className="text-[#a6adc8]">Performance Metrics & Biological Data.</p>
        </div>
        <div className="px-4 py-2 bg-[#252535] rounded-xl border border-[#313244] text-[#a6e3a1] text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={14} /> Live Updates
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* FOCUS CHART */}
        <TiltCard className="bg-[#252535]/80 backdrop-blur-md p-6 rounded-3xl border border-[#313244] shadow-2xl md:col-span-2 group hover:border-[#89b4fa]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-[#89b4fa] blur-[80px] opacity-5 group-hover:opacity-10 transition-opacity" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="text-[#89b4fa]" /> Focus Distribution
                </h3>
                <p className="text-xs text-[#a6adc8] mt-1">Last 7 Days (Minutes)</p>
            </div>
            <div className="text-3xl font-black text-white">{focusValues.reduce((a,b)=>a+b, 0)}<span className="text-sm font-normal text-[#585b70] ml-1">min</span></div>
          </div>

          <div className="flex items-end justify-between h-48 gap-3 relative z-10">
            {focusData.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group/bar">
                <div className="w-full relative h-full flex items-end rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 bg-[#1e1e2e] rounded-t-lg" />
                  <div 
                    className="w-full bg-gradient-to-t from-[#89b4fa] to-[#b4befe] transition-all duration-1000 ease-out group-hover/bar:brightness-125 relative shadow-[0_0_15px_rgba(137,180,250,0.3)]"
                    style={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/50" />
                  </div>
                </div>
                <span className="text-[10px] text-[#585b70] font-mono group-hover/bar:text-white transition-colors">{day.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </TiltCard>

        {/* TASK VELOCITY */}
        <TiltCard className="bg-[#252535]/80 backdrop-blur-md p-6 rounded-3xl border border-[#313244] shadow-2xl flex flex-col justify-between group hover:border-[#a6e3a1]/30">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle className="text-[#a6e3a1]" /> Task Velocity
            </h3>
            <div className="text-5xl font-black text-white mt-4">{completionRate}%</div>
            <p className="text-xs text-[#a6adc8] uppercase tracking-widest mt-1">Efficiency Rating</p>
          </div>
          
          <div className="mt-8 space-y-4">
            <SparkLine data={[10, 40, 30, 70, 50, completionRate]} color="#a6e3a1" />
            
            <div className="flex justify-between text-xs text-[#a6adc8] border-t border-[#313244] pt-4">
              <span>Completed</span>
              <span className="text-white font-mono">{completedTasks}/{totalTasks}</span>
            </div>
          </div>
        </TiltCard>

        {/* MOOD RING */}
        <TiltCard className="bg-[#252535]/80 backdrop-blur-md p-6 rounded-3xl border border-[#313244] shadow-2xl group hover:border-[#f9e2af]/30">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Brain className="text-[#f9e2af]" /> Mental State
          </h3>
          <div className="space-y-4">
            {Object.entries(moodCounts).map(([mood, count], i) => (
              <div key={mood} className="flex items-center gap-3 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${i*100}ms` }}>
                <span className={`text-xs font-bold uppercase w-16 ${
                  mood === 'Great' ? 'text-[#a6e3a1]' : 
                  mood === 'Good' ? 'text-[#89b4fa]' : 
                  mood === 'Bad' ? 'text-[#fab387]' : 'text-[#f9e2af]'
                }`}>{mood}</span>
                <div className="flex-1 h-3 bg-[#1e1e2e] rounded-full overflow-hidden border border-[#313244]">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor] ${
                      mood === 'Great' ? 'bg-[#a6e3a1] text-[#a6e3a1]' : 
                      mood === 'Good' ? 'bg-[#89b4fa] text-[#89b4fa]' : 
                      mood === 'Bad' ? 'bg-[#fab387] text-[#fab387]' : 'bg-[#f9e2af] text-[#f9e2af]'
                    }`} 
                    style={{ width: `${((count as number) / journalEntries.length) * 100}%` }} 
                  />
                </div>
                <span className="text-xs text-white font-mono w-4 text-right">{count as number}</span>
              </div>
            ))}
            {journalEntries.length === 0 && <div className="text-center text-[#585b70] text-xs py-4">No data available</div>}
          </div>
        </TiltCard>

        {/* Placeholder for Future Metric */}
        <div className="bg-[#1e1e2e] border-2 border-dashed border-[#313244] rounded-3xl p-6 flex flex-col items-center justify-center text-[#585b70] md:col-span-2">
            <BarChart3 size={48} className="opacity-20 mb-2" />
            <p className="text-sm font-bold uppercase tracking-widest">More Analytics Modules Locked</p>
        </div>

      </div>
    </div>
  );
}