import React, { useState } from 'react';
import { Target, Flag, Plus, Trash2, Calendar, CheckSquare, ChevronDown, ChevronRight, Activity, Map } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Goal } from '../../../types';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

const GoalCard = ({ goal }: { goal: Goal }) => {
  const { deleteGoal, updateGoalProgress, addGoalMilestone, toggleGoalMilestone } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newMilestone, setNewMilestone] = useState('');

  const handleAddMilestone = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newMilestone.trim()) {
      addGoalMilestone(goal.id, newMilestone);
      setNewMilestone('');
    }
  };

  return (
    <TiltCard className="bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl p-6 transition-all hover:border-[#89b4fa]/30 group relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"
        style={{ backgroundColor: goal.color }}
      />

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-5">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#1e1e2e] border border-[#313244] shadow-lg group-hover:scale-110 transition-transform duration-300" 
            style={{ color: goal.color }}
          >
            <Target size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">{goal.title}</h3>
            <div className="flex items-center gap-2 text-xs text-[#a6adc8] mt-1 font-mono">
              <Calendar size={12} />
              TARGET: {new Date(goal.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
        <MagneticButton onClick={() => deleteGoal(goal.id)} className="text-[#f38ba8] opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#f38ba8]/10 rounded-lg">
          <Trash2 size={18} />
        </MagneticButton>
      </div>

      {/* PROGRESS BAR */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between text-xs font-bold text-[#a6adc8] mb-2 uppercase tracking-widest">
          <span>Completion Status</span>
          <span style={{ color: goal.color }}>{goal.progress}%</span>
        </div>
        <div className="w-full h-4 bg-[#1e1e2e] rounded-full overflow-hidden relative group/bar cursor-ew-resize border border-[#313244] shadow-inner">
          <div 
            className="h-full transition-all duration-700 relative" 
            style={{ width: `${goal.progress}%`, backgroundColor: goal.color }} 
          >
            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
          </div>
          {/* Slider for manual override */}
          <input 
            type="range" min="0" max="100" value={goal.progress}
            onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            title="Drag to manually adjust progress"
          />
        </div>
      </div>

      {/* MILESTONES (Connected Nodes) */}
      <div className="border-t border-[#313244] pt-4 relative z-10">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-bold text-[#a6adc8] hover:text-white transition-colors mb-4 group/toggle"
        >
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
            <ChevronRight size={16} />
          </div>
          MILESTONES <span className="bg-[#1e1e2e] px-2 rounded text-xs border border-[#313244]">{goal.milestones?.filter(m => m.completed).length || 0}/{goal.milestones?.length || 0}</span>
        </button>

        {isExpanded && (
          <div className="space-y-0 animate-in slide-in-from-top-2 duration-300 relative pl-2">
            {/* Connecting Line */}
            <div className="absolute left-[15px] top-2 bottom-8 w-0.5 bg-[#313244]" />
            
            {goal.milestones?.map((ms, idx) => (
              <div key={ms.id} className="flex items-center gap-4 py-2 relative group/node">
                {/* Node Dot */}
                <button 
                  onClick={() => toggleGoalMilestone(goal.id, ms.id)}
                  className={`w-3 h-3 rounded-full border-2 z-10 transition-all duration-300 hover:scale-125
                    ${ms.completed ? `bg-[${goal.color}] border-[${goal.color}] shadow-[0_0_10px_currentColor]` : 'bg-[#1e1e2e] border-[#585b70] hover:border-white'}
                  `}
                  style={{ backgroundColor: ms.completed ? goal.color : '#1e1e2e', borderColor: ms.completed ? goal.color : '' }}
                />
                
                <span className={`text-sm transition-all ${ms.completed ? 'text-[#585b70] line-through' : 'text-[#cdd6f4]'}`}>
                  {ms.title}
                </span>
              </div>
            ))}
            
            {/* Add New Input */}
            <div className="relative mt-2 pl-7">
                <Plus size={14} className="absolute left-0 top-3 text-[#585b70]" />
                <input 
                    placeholder="Add milestone node..."
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    onKeyDown={handleAddMilestone}
                    className="w-full bg-[#1e1e2e] py-2 px-4 rounded-xl text-sm text-white outline-none border border-[#313244] focus:border-[#89b4fa] transition-all placeholder-[#585b70]"
                />
            </div>
          </div>
        )}
      </div>
    </TiltCard>
  );
};

export default function GoalsModule() {
  const { goals, addGoal } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newColor, setNewColor] = useState('#89b4fa');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newTitle.trim() || !newDate) return;
    setIsAdding(true);
    await addGoal(newTitle, newDate, newColor);
    setNewTitle(''); setNewDate(''); setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Strategic Map <span className="text-xs bg-[#89b4fa]/10 text-[#89b4fa] px-2 py-1 rounded border border-[#89b4fa]/20 font-mono tracking-widest">GOALS</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Long-term objectives and tactical milestones.</p>
        </div>
      </div>

      {/* CREATE BAR */}
      <TiltCard className="bg-[#252535] p-5 rounded-3xl border border-[#313244] shadow-xl flex flex-col md:flex-row gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        
        <input 
          placeholder="Initialize New Objective..."
          value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 bg-[#1e1e2e] px-5 py-4 rounded-2xl border border-[#313244] text-white outline-none focus:border-[#89b4fa] transition-all placeholder-[#585b70] shadow-inner"
        />
        <div className="flex gap-3">
          <input 
            type="date" 
            value={newDate} onChange={(e) => setNewDate(e.target.value)}
            className="bg-[#1e1e2e] px-4 py-3 rounded-2xl border border-[#313244] text-white outline-none focus:border-[#89b4fa] shadow-inner font-mono text-sm"
          />
          <div className="relative group w-14 rounded-2xl overflow-hidden border border-[#313244]">
             <input 
                type="color" 
                value={newColor} onChange={(e) => setNewColor(e.target.value)}
                className="absolute inset-0 w-[200%] h-[200%] cursor-pointer p-0 m-[-50%]"
             />
          </div>
          <MagneticButton onClick={handleAdd} className="bg-[#89b4fa] text-[#1e1e2e] font-bold px-6 rounded-2xl hover:bg-white transition-all shadow-[0_0_20px_rgba(137,180,250,0.4)]">
            <Plus size={20} /> Deploy
          </MagneticButton>
        </div>
      </TiltCard>

      {/* GOAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
        
        {goals.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-[#313244] rounded-3xl group hover:border-[#89b4fa]/30 transition-colors">
            <div className="p-6 bg-[#1e1e2e] rounded-full inline-block mb-4 group-hover:scale-110 transition-transform">
                <Map size={48} className="text-[#313244] group-hover:text-[#89b4fa]" />
            </div>
            <h3 className="text-[#a6adc8] font-bold text-lg">No Strategy Defined</h3>
            <p className="text-[#585b70]">Deploy a new objective to begin the campaign.</p>
          </div>
        )}
      </div>
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}