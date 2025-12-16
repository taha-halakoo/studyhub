import React, { useState, useRef } from 'react';
import { Plus, Trash2, Calendar as CalIcon, CheckSquare, Layout, List, Grid, ChevronDown, ChevronRight, AlertCircle, Clock, Repeat, Skull, Zap, ClipboardList } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Task, Subtask } from '../../../types';
import { TiltCard } from '../../ui/TiltCard';
import { MagneticButton } from '../../ui/MagneticButton';
import { EmptyState } from '../../ui/EmptyState';

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors = {
    High: "bg-[#f38ba8]/20 text-[#f38ba8] border-[#f38ba8]/50 shadow-[0_0_10px_rgba(243,139,168,0.2)]",
    Medium: "bg-[#f9e2af]/20 text-[#f9e2af] border-[#f9e2af]/50",
    Low: "bg-[#a6e3a1]/20 text-[#a6e3a1] border-[#a6e3a1]/50"
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${colors[priority as keyof typeof colors]} backdrop-blur-md`}>
      {priority}
    </span>
  );
};

const SubtaskList = ({ task }: { task: Task }) => {
  const { addSubtask, toggleSubtask } = useApp();
  const [newSub, setNewSub] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSub.trim()) {
      addSubtask(task.id, newSub);
      setNewSub('');
    }
  };

  const completedCount = task.subtasks?.filter((s: Subtask) => s.completed).length || 0;
  const totalCount = task.subtasks?.length || 0;

  return (
    <div className="w-full mt-3 border-t border-[#313244] pt-2">
      <div 
        className="flex items-center gap-2 text-xs text-[#a6adc8] cursor-pointer hover:text-white mb-2 select-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="transition-transform duration-300 group-hover:translate-x-1">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
        {task.is_boss ? <span className="text-[#f38ba8] font-bold tracking-widest animate-pulse">WEAK POINTS</span> : <span>Subtasks</span>}
        <div className="flex-1 h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden ml-2 border border-[#313244]">
          <div 
            className={`h-full transition-all duration-500 ease-out ${task.is_boss ? 'bg-[#f38ba8]' : 'bg-[#89b4fa]'}`}
            style={{ width: totalCount ? `${(completedCount/totalCount)*100}%` : '0%' }} 
          />
        </div>
        <span className="font-mono">{completedCount}/{totalCount}</span>
      </div>

      {isOpen && (
        <div className="pl-2 space-y-2 animate-in slide-in-from-top-2 duration-300">
          {task.subtasks?.map((sub: Subtask) => (
            <div key={sub.id} className="flex items-center gap-3 group/sub">
              <button 
                onClick={() => toggleSubtask(task.id, sub.id)}
                className={`w-4 h-4 border rounded-md flex items-center justify-center transition-all duration-300
                  ${sub.completed ? 'bg-[#89b4fa] border-[#89b4fa] rotate-0' : 'border-[#585b70] hover:border-[#89b4fa] hover:rotate-90'}
                `}
              >
                {sub.completed && <CheckSquare size={12} className="text-[#1e1e2e]" />}
              </button>
              <span className={`text-sm transition-all ${sub.completed ? 'text-[#585b70] line-through blur-[0.5px]' : 'text-[#cdd6f4]'}`}>
                {sub.title}
              </span>
            </div>
          ))}
          <input 
            placeholder={task.is_boss ? "+ Add Weak Point" : "+ Add subtask"}
            value={newSub}
            onChange={(e) => setNewSub(e.target.value)}
            onKeyDown={handleAdd}
            className="w-full bg-[#1e1e2e]/50 border border-[#313244] focus:border-[#89b4fa] rounded-lg px-3 py-2 text-xs text-white outline-none transition-all placeholder-[#585b70]"
          />
        </div>
      )}
    </div>
  );
};

export default function TasksModule() {
  const { tasks, addTask, toggleTask, deleteTask, updateTaskPriority } = useApp();
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("");
  const [recurrence, setRecurrence] = useState("None");
  const [isBoss, setIsBoss] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'matrix'>('list');
  const [isAdding, setIsAdding] = useState(false);

  // Drag & Drop
  const handleDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData('taskId', id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (e: React.DragEvent, targetPriority: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && targetPriority !== 'completed') await updateTaskPriority(taskId, targetPriority);
  };

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    setIsAdding(true);
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    await addTask(newTask, priority, date, tagArray, recurrence, undefined, isBoss);
    setNewTask(""); setDate(""); setTags(""); setRecurrence("None"); setIsBoss(false);
    setIsAdding(false);
  };

  // View Data Prep
  const columns = {
    High: tasks.filter((t: Task) => !t.is_completed && t.priority === 'High'),
    Medium: tasks.filter((t: Task) => !t.is_completed && t.priority === 'Medium'),
    Low: tasks.filter((t: Task) => !t.is_completed && t.priority === 'Low'),
    Completed: tasks.filter((t: Task) => t.is_completed)
  };

  const now = new Date();
  const threeDaysFromNow = new Date(); threeDaysFromNow.setDate(now.getDate() + 3);
  const isUrgent = (t: Task) => t.due_date ? new Date(t.due_date) <= threeDaysFromNow : false;

  const matrix = {
    q1: tasks.filter((t: Task) => !t.is_completed && t.priority === 'High' && isUrgent(t)),
    q2: tasks.filter((t: Task) => !t.is_completed && t.priority === 'High' && !isUrgent(t)),
    q3: tasks.filter((t: Task) => !t.is_completed && t.priority !== 'High' && isUrgent(t)),
    q4: tasks.filter((t: Task) => !t.is_completed && t.priority !== 'High' && !isUrgent(t)),
  };

  const TaskCard = ({ task, compact = false }: { task: Task, compact?: boolean }) => (
    <TiltCard 
      className={`
        relative group rounded-xl border transition-all duration-300
        ${task.is_boss 
          ? 'bg-[#1e1e2e] border-[#f38ba8]/50 shadow-[0_0_20px_rgba(243,139,168,0.15)]' 
          : 'bg-[#252535]/80 backdrop-blur-sm border-[#313244] hover:border-[#89b4fa]/50 hover:bg-[#252535]'
        }
        ${compact ? 'p-2 mb-2' : 'p-4 mb-4'}
      `}
    >
      {/* Boss Effects */}
      {task.is_boss && <div className="absolute inset-0 bg-[#f38ba8]/5 animate-pulse rounded-xl pointer-events-none" />}
      
      <div className="relative z-10 flex items-start gap-3">
        {/* Checkbox */}
        <button 
          onClick={() => toggleTask(task.id, task.is_completed)} 
          className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
            ${task.is_completed 
              ? 'bg-[#a6e3a1] border-[#a6e3a1] text-[#1e1e2e]' 
              : task.is_boss ? 'border-[#f38ba8] hover:bg-[#f38ba8] hover:text-[#1e1e2e]' : 'border-[#585b70] hover:border-[#89b4fa]'
            }
          `}
        >
          {task.is_completed ? <CheckSquare size={16} /> : task.is_boss ? <Skull size={14} /> : null}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <span className={`font-medium truncate transition-all ${task.is_completed ? "text-[#585b70] line-through" : "text-white"}`}>
              {task.title}
            </span>
            {!compact && (
                <MagneticButton onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-[#f38ba8] p-1 hover:bg-[#f38ba8]/10 rounded">
                    <Trash2 size={14} />
                </MagneticButton>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {!task.is_boss && <PriorityBadge priority={task.priority} />}
            {task.is_boss && <span className="text-[10px] font-black text-[#f38ba8] bg-[#f38ba8]/10 px-2 py-0.5 rounded border border-[#f38ba8]/30 flex items-center gap-1"><Zap size={10} fill="currentColor"/> BOSS</span>}
            
            {task.due_date && (
                <span className={`text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded border ${isUrgent(task) ? 'text-[#fab387] border-[#fab387]/30 bg-[#fab387]/10' : 'text-[#a6adc8] border-[#313244] bg-[#1e1e2e]'}`}>
                    <CalIcon size={10} />{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                </span>
            )}
            
            {task.tags?.map(tag => (
                <span key={tag} className="text-[10px] text-[#89b4fa] bg-[#89b4fa]/10 px-1.5 py-0.5 rounded border border-[#89b4fa]/20">#{tag}</span>
            ))}
          </div>

          {/* Boss HP Bar */}
          {task.is_boss && task.boss_hp !== undefined && (
             <div className="mt-3 w-full h-2 bg-[#1e1e2e] rounded-full overflow-hidden border border-[#313244] shadow-inner">
                 <div 
                    className="h-full bg-gradient-to-r from-[#f38ba8] to-[#fab387] transition-all duration-500 relative" 
                    style={{ width: `${task.boss_hp}%` }} 
                 >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                 </div>
             </div>
          )}

          {!compact && !task.is_completed && <SubtaskList task={task} />}
        </div>
      </div>
    </TiltCard>
  );

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Task Engineering <span className="text-xs bg-[#89b4fa]/10 text-[#89b4fa] px-2 py-1 rounded border border-[#89b4fa]/20 font-mono tracking-widest">PROTOCOL</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Manage directives and execute operations.</p>
        </div>
        <div className="bg-[#252535] p-1 rounded-xl border border-[#313244] flex shadow-lg">
          {['list', 'board', 'matrix'].map(mode => (
            <button 
                key={mode}
                onClick={() => setViewMode(mode as any)} 
                className={`p-2.5 rounded-lg transition-all ${viewMode === mode ? 'bg-[#313244] text-[#89b4fa] shadow-sm' : 'text-[#a6adc8] hover:text-white'}`}
            >
                {mode === 'list' ? <List size={18} /> : mode === 'board' ? <Layout size={18} /> : <Grid size={18} />}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <TiltCard className="bg-[#252535] p-4 rounded-2xl border border-[#313244] shadow-xl shrink-0 flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 bg-[#89b4fa] blur-[100px] opacity-10" />
        <div className="relative z-10 flex flex-col md:flex-row gap-3">
            <input 
                placeholder="Initialize new directive..." 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()} 
                className="flex-1 bg-[#1e1e2e] text-white px-4 py-3 rounded-xl border border-[#313244] focus:border-[#89b4fa] outline-none transition-all placeholder-[#585b70]"
            />
            <MagneticButton onClick={handleAdd} className="bg-[#89b4fa] text-[#1e1e2e] font-bold px-6 py-3 rounded-xl hover:bg-white shadow-[0_0_15px_rgba(137,180,250,0.3)] transition-all">
                <Plus size={20} /> Initialize
            </MagneticButton>
        </div>
        <div className="relative z-10 flex flex-wrap gap-2 items-center">
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="bg-[#1e1e2e] text-[#cdd6f4] px-3 py-2 rounded-lg border border-[#313244] text-xs outline-none hover:border-[#89b4fa]"><option>High</option><option>Medium</option><option>Low</option></select>
            <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)} className="bg-[#1e1e2e] text-[#cdd6f4] px-3 py-2 rounded-lg border border-[#313244] text-xs outline-none hover:border-[#89b4fa]"><option>None</option><option>Daily</option><option>Weekly</option><option>Monthly</option></select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-[#1e1e2e] text-[#cdd6f4] px-3 py-2 rounded-lg border border-[#313244] text-xs outline-none hover:border-[#89b4fa]" />
            <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="bg-[#1e1e2e] text-[#cdd6f4] px-3 py-2 rounded-lg border border-[#313244] text-xs outline-none hover:border-[#89b4fa] flex-1 min-w-[100px]" />
            
            <button 
                onClick={() => setIsBoss(!isBoss)}
                className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${isBoss ? 'bg-[#f38ba8] text-[#1e1e2e] border-[#f38ba8] shadow-[0_0_10px_#f38ba8]' : 'bg-[#1e1e2e] text-[#a6adc8] border-[#313244] hover:text-white'}`}
            >
                <Skull size={14} /> Boss Mode
            </button>
        </div>
      </TiltCard>

      {/* Views */}
      <div className="flex-1 overflow-hidden relative">
        
        {viewMode === 'list' && (
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
                {tasks.map(t => <div key={t.id} draggable onDragStart={(e) => handleDragStart(e, t.id)}><TaskCard task={t} /></div>)}
                {tasks.length === 0 && (
                  <EmptyState 
                    title="No Directives Found" 
                    description="Initialize a new directive to begin operations." 
                    icon={ClipboardList} 
                  />
                )}
            </div>
        )}

        {viewMode === 'board' && (
            <div className="h-full overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-6 h-full min-w-[1200px]">
                    {['High', 'Medium', 'Low'].map(colKey => (
                        <div 
                            key={colKey} 
                            onDragOver={handleDragOver} 
                            onDrop={(e) => handleDrop(e, colKey)}
                            className="flex-1 bg-[#252535]/30 rounded-2xl p-4 border border-[#313244] flex flex-col relative overflow-hidden backdrop-blur-sm"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#89b4fa]/20 to-transparent" />
                            <h3 className="text-[#a6adc8] font-bold uppercase text-xs mb-4 flex items-center gap-2 bg-[#1e1e2e] w-fit px-3 py-1 rounded-full border border-[#313244]">
                                {colKey} Priority <span className="text-[#585b70]">{(columns as any)[colKey].length}</span>
                            </h3>
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                                {(columns as any)[colKey].map((t: Task) => <TaskCard key={t.id} task={t} compact />)}
                            </div>
                        </div>
                    ))}
                    <div className="w-80 bg-[#1e1e2e]/50 rounded-2xl p-4 border border-[#313244] flex flex-col opacity-75 hover:opacity-100 transition-opacity">
                        <h3 className="text-[#585b70] font-bold uppercase text-xs mb-4 flex items-center gap-2"><CheckSquare size={14}/> Archive</h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                            {columns.Completed.map((t: Task) => <TaskCard key={t.id} task={t} compact />)}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {viewMode === 'matrix' && (
            <div className="h-full grid grid-cols-2 grid-rows-2 gap-4 pb-2">
                {[
                    { id: 'q1', title: 'DO', icon: AlertCircle, color: '#f38ba8', data: matrix.q1 },
                    { id: 'q2', title: 'SCHEDULE', icon: CalIcon, color: '#89b4fa', data: matrix.q2 },
                    { id: 'q3', title: 'DELEGATE', icon: Clock, color: '#f9e2af', data: matrix.q3 },
                    { id: 'q4', title: 'ELIMINATE', icon: Trash2, color: '#a6adc8', data: matrix.q4 }
                ].map(quad => (
                    <TiltCard key={quad.id} className={`bg-[#252535]/50 border border-[${quad.color}]/30 rounded-2xl p-4 flex flex-col relative overflow-hidden group hover:bg-[#252535]`}>
                        <div className={`absolute inset-0 bg-[${quad.color}]/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <h3 className={`font-black text-[${quad.color}] mb-4 flex items-center gap-2 relative z-10`}>
                            <quad.icon size={18} /> {quad.title}
                        </h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 space-y-2 pr-2">
                            {quad.data.map((t: Task) => <TaskCard key={t.id} task={t} compact />)}
                        </div>
                    </TiltCard>
                ))}
            </div>
        )}

      </div>
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}