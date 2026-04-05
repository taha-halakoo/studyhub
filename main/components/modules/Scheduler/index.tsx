import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Repeat, Play, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 15 }, (_, i) => `${i + 7}:00`); // 7:00 to 21:00

export default function SchedulerModule() {
  const { timeBlocks, addTimeBlock, deleteTimeBlock, routines, addRoutine, executeRoutine, deleteRoutine } = useApp();
  const [activeTab, setActiveTab] = useState<'Weekly' | 'Routines'>('Weekly');
  
  // New Block State
  const [newDay, setNewDay] = useState('Monday');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('10:00');
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState('#89b4fa');

  // New Routine State
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineTasks, setRoutineTasks] = useState('');

  const handleAddBlock = async () => {
    if (!newTitle) return;
    await addTimeBlock(newDay, newStart, newEnd, newTitle, newColor);
    setNewTitle('');
  };

  const handleAddRoutine = async () => {
    if (!routineTitle) return;
    const tasks = routineTasks.split(',').map(t => t.trim()).filter(Boolean);
    await addRoutine(routineTitle, tasks, 'Repeat');
    setRoutineTitle(''); setRoutineTasks('');
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in pb-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Scheduler <span className="text-xs bg-[#89b4fa]/10 text-[#89b4fa] px-2 py-1 rounded border border-[#89b4fa]/20 font-mono tracking-widest">TEMPORAL</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Time allocation and routine execution.</p>
        </div>
        <div className="bg-[#252535] p-1.5 rounded-2xl border border-[#313244] flex shadow-lg">
            <button onClick={() => setActiveTab('Weekly')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'Weekly' ? 'bg-[#1e1e2e] text-[#89b4fa] shadow-sm border border-[#313244]' : 'text-[#585b70] hover:text-white'}`}>Weekly Grid</button>
            <button onClick={() => setActiveTab('Routines')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'Routines' ? 'bg-[#1e1e2e] text-[#a6e3a1] shadow-sm border border-[#313244]' : 'text-[#585b70] hover:text-white'}`}>Sub-Routines</button>
        </div>
      </div>

      {activeTab === 'Weekly' ? (
        <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
            {/* WEEK VIEW */}
            <TiltCard className="flex-1 bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl p-6 overflow-hidden shadow-2xl relative flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#89b4fa] via-[#cba6f7] to-[#89b4fa] opacity-30" />
                
                <div className="flex-1 overflow-auto custom-scrollbar relative">
                    <div className="grid grid-cols-8 min-w-[1000px] border-l border-[#313244]">
                        {/* Header */}
                        <div className="sticky top-0 bg-[#252535] z-20 border-b border-[#313244]"></div>
                        {DAYS.map(day => (
                            <div key={day} className="sticky top-0 bg-[#252535] z-20 text-center font-black text-[#585b70] text-xs uppercase py-4 border-b border-r border-[#313244] tracking-widest">{day}</div>
                        ))}
                        
                        {/* Grid */}
                        {HOURS.map(hour => (
                            <React.Fragment key={hour}>
                                <div className="text-[10px] text-[#585b70] text-right pr-3 py-3 -mt-2.5 font-mono border-r border-[#313244] bg-[#252535]/50 sticky left-0 z-10">{hour}</div>
                                {DAYS.map(day => (
                                    <div key={`${day}-${hour}`} className="border-b border-r border-[#313244]/30 h-16 relative group">
                                        {timeBlocks.filter(b => b.day === day && b.start_time === hour).map(block => (
                                            <div 
                                                key={block.id} 
                                                className="absolute inset-1 rounded-lg p-2 text-[10px] font-bold text-[#1e1e2e] overflow-hidden z-20 hover:scale-105 transition-transform cursor-pointer shadow-lg animate-in zoom-in duration-300 flex flex-col justify-center border border-black/10"
                                                style={{ backgroundColor: block.color, height: `calc(${Math.max(1, parseInt(block.end_time.split(':')[0]) - parseInt(block.start_time.split(':')[0])) * 100}% - 8px)` }} 
                                            >
                                                <span className="line-clamp-2">{block.title}</span>
                                                <button onClick={() => deleteTimeBlock(block.id)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-red-900 bg-white/20 rounded p-0.5"><Trash2 size={8} /></button>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </TiltCard>

            {/* SIDEBAR EDITOR */}
            <TiltCard className="w-80 bg-[#252535] border border-[#313244] rounded-3xl p-6 flex flex-col gap-4 h-fit sticky top-0 shadow-xl">
                <h3 className="font-bold text-white flex items-center gap-2"><Clock size={18} className="text-[#89b4fa]"/> Allocate Time</h3>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Event Title" className="bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa]" />
                <select value={newDay} onChange={e => setNewDay(e.target.value)} className="bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] outline-none">{DAYS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                <div className="flex gap-2">
                    <select value={newStart} onChange={e => setNewStart(e.target.value)} className="bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] w-full text-xs">{HOURS.map(h => <option key={h} value={h}>{h}</option>)}</select>
                    <div className="flex items-center text-[#585b70]"><ChevronRight size={14}/></div>
                    <select value={newEnd} onChange={e => setNewEnd(e.target.value)} className="bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] w-full text-xs">{HOURS.map(h => <option key={h} value={h}>{h}</option>)}</select>
                </div>
                <div className="relative h-10 w-full rounded-xl overflow-hidden border border-[#313244]">
                    <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] m-[-10px] cursor-pointer" />
                </div>
                <MagneticButton onClick={handleAddBlock} className="bg-[#89b4fa] text-[#1e1e2e] py-3 rounded-xl font-bold hover:bg-white shadow-[0_0_15px_rgba(137,180,250,0.3)] transition-all">
                    <Plus size={16} className="inline mr-2" /> Block Time
                </MagneticButton>
            </TiltCard>
        </div>
      ) : (
        <div className="flex-1 flex gap-8 min-h-0">
            {/* ROUTINE LIST */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar">
                {routines.map(routine => (
                    <TiltCard key={routine.id} className="bg-[#252535] border border-[#313244] p-6 rounded-3xl group relative overflow-hidden flex flex-col justify-between h-64 hover:border-[#a6e3a1]/30">
                        <div className="absolute top-0 right-0 p-10 bg-[#a6e3a1] blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" />
                        
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[#1e1e2e] rounded-2xl text-[#a6e3a1] shadow-lg border border-[#313244] group-hover:scale-110 transition-transform"><Repeat size={24} /></div>
                                <div className="flex gap-2 relative z-10">
                                    <button onClick={() => executeRoutine(routine.id)} className="p-2 bg-[#a6e3a1] text-[#1e1e2e] rounded-xl hover:bg-white shadow-[0_0_10px_rgba(166,227,161,0.4)] transition-all"><Play size={16} fill="currentColor" /></button>
                                    <button onClick={() => deleteRoutine(routine.id)} className="p-2 text-[#f38ba8] hover:bg-[#f38ba8]/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-white mb-3">{routine.title}</h3>
                            <div className="space-y-1.5">
                                {routine.tasks.slice(0, 3).map((task, i) => (
                                    <div key={i} className="text-sm text-[#a6adc8] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#585b70]" /> {task}
                                    </div>
                                ))}
                                {routine.tasks.length > 3 && <div className="text-xs text-[#585b70] italic pl-3.5">+{routine.tasks.length - 3} more...</div>}
                            </div>
                        </div>
                    </TiltCard>
                ))}
            </div>

            {/* CREATE ROUTINE */}
            <TiltCard className="w-96 bg-[#252535] border border-[#313244] rounded-3xl p-6 h-fit sticky top-0 shadow-xl">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Zap size={20} className="text-[#a6e3a1]"/> Design Routine</h3>
                <div className="space-y-4">
                    <input value={routineTitle} onChange={e => setRoutineTitle(e.target.value)} placeholder="Routine Name (e.g. Morning Protocol)" className="w-full bg-[#1e1e2e] p-4 rounded-xl text-white border border-[#313244] outline-none focus:border-[#a6e3a1]" />
                    <textarea value={routineTasks} onChange={e => setRoutineTasks(e.target.value)} placeholder="Tasks to execute (comma separated)..." className="w-full bg-[#1e1e2e] p-4 rounded-xl text-white border border-[#313244] h-40 resize-none outline-none focus:border-[#a6e3a1]" />
                    <MagneticButton onClick={handleAddRoutine} className="w-full bg-[#a6e3a1] text-[#1e1e2e] py-3 rounded-xl font-bold hover:bg-white shadow-[0_0_15px_rgba(166,227,161,0.3)] transition-all">
                        Compile Routine
                    </MagneticButton>
                </div>
            </TiltCard>
        </div>
      )}
    </div>
  );
}