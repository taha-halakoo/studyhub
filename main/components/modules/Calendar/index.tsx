import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { TiltCard } from '../../ui/TiltCard';
import { MagneticButton } from '../../ui/MagneticButton';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarModule() {
  const { tasks } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Get tasks for a specific day
  const getTasksForDay = (day: number) => {
    return tasks.filter(t => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  };

  const today = new Date();

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Timeline <span className="text-xs bg-[#89b4fa]/10 text-[#89b4fa] px-2 py-1 rounded border border-[#89b4fa]/20 font-mono tracking-widest">TEMPORAL GRID</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Schedule Matrix & Event Horizon.</p>
        </div>
        <div className="flex items-center gap-4 bg-[#252535] p-1.5 rounded-2xl border border-[#313244]">
          <MagneticButton onClick={prevMonth} className="p-3 bg-[#1e1e2e] rounded-xl text-[#a6adc8] hover:text-white hover:bg-[#313244] transition-all">
            <ChevronLeft size={20} />
          </MagneticButton>
          <div className="w-[180px] text-center">
            <div className="text-lg font-black text-white">{currentDate.toLocaleDateString('en-US', { month: 'long' })}</div>
            <div className="text-xs text-[#585b70] font-mono tracking-[0.2em]">{currentDate.getFullYear()}</div>
          </div>
          <MagneticButton onClick={nextMonth} className="p-3 bg-[#1e1e2e] rounded-xl text-[#a6adc8] hover:text-white hover:bg-[#313244] transition-all">
            <ChevronRight size={20} />
          </MagneticButton>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <TiltCard className="flex-1 bg-[#252535]/80 backdrop-blur-xl border border-[#313244] rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col relative group">
        
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#89b4fa] via-[#cba6f7] to-[#89b4fa] opacity-50" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#89b4fa] blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />

        {/* Days Header */}
        <div className="grid grid-cols-7 mb-4 border-b border-[#313244] pb-4">
          {DAYS.map(day => (
            <div key={day} className="text-center font-black text-[#585b70] uppercase text-xs tracking-[0.2em]">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 flex-1 gap-2 md:gap-3">
          {/* Empty slots for previous month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="opacity-5 bg-[#1e1e2e] rounded-2xl border border-transparent" />
          ))}

          {/* Actual Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayTasks = getTasksForDay(day);
            const isToday = today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

            return (
              <div 
                key={day} 
                className={`
                  relative p-3 rounded-2xl border transition-all duration-300 group/day flex flex-col gap-2 overflow-hidden
                  ${isToday 
                    ? 'bg-[#89b4fa]/10 border-[#89b4fa] shadow-[0_0_20px_rgba(137,180,250,0.15)]' 
                    : 'bg-[#1e1e2e] border-[#313244] hover:border-[#585b70] hover:bg-[#252535]'
                  }
                `}
              >
                {isToday && <div className="absolute inset-0 bg-[#89b4fa]/5 animate-pulse" />}
                
                <div className="flex justify-between items-start z-10">
                    <span className={`text-lg font-black font-mono ${isToday ? 'text-[#89b4fa]' : 'text-[#585b70] group-hover/day:text-white'}`}>
                    {day}
                    </span>
                    {dayTasks.length > 0 && (
                        <span className="text-[10px] font-bold bg-[#313244] px-1.5 rounded text-[#a6adc8] border border-[#45475a]">
                            {dayTasks.length}
                        </span>
                    )}
                </div>
                
                <div className="flex-1 space-y-1 z-10">
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id} 
                      className="h-1.5 rounded-full w-full bg-[#313244] overflow-hidden"
                      title={task.title}
                    >
                        <div className={`h-full w-full ${task.priority === 'High' ? 'bg-[#f38ba8]' : 'bg-[#89b4fa]'}`} />
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                      <div className="flex justify-center">
                          <div className="w-1 h-1 bg-[#585b70] rounded-full" />
                      </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </TiltCard>
    </div>
  );
}