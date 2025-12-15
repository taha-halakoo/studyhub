import React, { useState } from 'react';
import { Calculator, Terminal, Moon, Clock, Cpu, Code, Activity, Zap } from 'lucide-react';
import { TiltCard } from '../../ui/TiltCard';
import { MagneticButton } from '../../ui/MagneticButton';

const ToolCard = ({ title, icon: Icon, children, color }: any) => (
  <TiltCard className={`bg-[#252535]/80 backdrop-blur-xl border border-[#313244] rounded-3xl p-8 hover:border-[${color}]/50 transition-all duration-500 group relative overflow-hidden h-full flex flex-col`}>
    <div className={`absolute top-0 right-0 p-20 bg-[${color}] blur-[100px] opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none`} />
    
    <div className="flex items-center gap-4 mb-8 border-b border-[#313244] pb-6 relative z-10">
      <div className={`p-3.5 rounded-2xl bg-[#1e1e2e] text-[${color}] border border-[#313244] shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
      <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
    </div>
    <div className="relative z-10 flex-1 flex flex-col">{children}</div>
  </TiltCard>
);

export default function ToolsModule() {
  // GPA State
  const [currentGrade, setCurrentGrade] = useState(85);
  const [examWeight, setExamWeight] = useState(30);
  const [targetGrade, setTargetGrade] = useState(90);

  // Regex State
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');

  // Sleep State
  const [wakeTime, setWakeTime] = useState('07:00');
  const [cycles, setCycles] = useState<string[]>([]);

  // GPA Calculation
  const requiredScore = (targetGrade - (currentGrade * (1 - examWeight / 100))) / (examWeight / 100);
  const isImpossible = requiredScore > 100;

  // Regex Calculation
  let regexMatch = false;
  try {
    if (pattern && testString) regexMatch = new RegExp(pattern).test(testString);
  } catch (e) {}

  // Sleep Calculation
  const calculateSleep = () => {
    const [hours, minutes] = wakeTime.split(':').map(Number);
    const wake = new Date();
    wake.setHours(hours, minutes, 0);

    const results = [];
    for (let i = 6; i >= 4; i--) {
        const sleep = new Date(wake.getTime() - (i * 90 * 60 * 1000));
        results.push(sleep.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    setCycles(results);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Engineering Toolkit <span className="text-xs bg-[#f9e2af]/10 text-[#f9e2af] px-2 py-1 rounded border border-[#f9e2af]/20 font-mono tracking-widest">UTILS</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Computational utilities for system optimization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* TOOL 1: GRADE SIMULATOR */}
        <ToolCard title="Grade Simulator" icon={Calculator} color="#89b4fa">
          <div className="space-y-8 flex-1">
            <div>
              <label className="flex justify-between text-xs font-bold text-[#a6adc8] uppercase mb-3 tracking-widest">
                Current Average <span className="text-white bg-[#1e1e2e] px-2 rounded border border-[#313244]">{currentGrade}%</span>
              </label>
              <input 
                type="range" min="0" max="100" value={currentGrade} 
                onChange={(e) => setCurrentGrade(Number(e.target.value))}
                className="w-full h-3 bg-[#1e1e2e] rounded-full appearance-none cursor-pointer accent-[#89b4fa] border border-[#313244]"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-[#a6adc8] uppercase block mb-2 ml-1">Exam Weight (%)</label>
                <input type="number" value={examWeight} onChange={(e) => setExamWeight(Number(e.target.value))} className="w-full bg-[#1e1e2e] p-4 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa] font-mono shadow-inner text-center" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-[#a6adc8] uppercase block mb-2 ml-1">Target Grade (%)</label>
                <input type="number" value={targetGrade} onChange={(e) => setTargetGrade(Number(e.target.value))} className="w-full bg-[#1e1e2e] p-4 rounded-xl text-white border border-[#313244] outline-none focus:border-[#a6e3a1] font-mono shadow-inner text-center" />
              </div>
            </div>
            <div className={`mt-auto p-6 rounded-2xl border transition-all ${isImpossible ? 'bg-[#f38ba8]/10 border-[#f38ba8]/30' : 'bg-[#1e1e2e] border-[#89b4fa]/30'} flex justify-between items-center shadow-lg`}>
              <div>
                  <div className="text-xs text-[#a6adc8] font-bold uppercase tracking-widest mb-1">Required Score</div>
                  <div className={`text-4xl font-black ${isImpossible ? 'text-[#f38ba8]' : 'text-[#89b4fa]'}`}>{requiredScore.toFixed(1)}%</div>
              </div>
              {isImpossible && <Activity className="text-[#f38ba8] animate-pulse" size={32} />}
            </div>
          </div>
        </ToolCard>

        {/* TOOL 2: SLEEP CALCULATOR */}
        <ToolCard title="Circadian Rhythm" icon={Moon} color="#f9e2af">
            <div className="space-y-6 flex-1 flex flex-col">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-[#a6adc8] uppercase block mb-2 ml-1">Wake Up Time</label>
                        <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="w-full bg-[#1e1e2e] p-4 rounded-xl text-white border border-[#313244] outline-none focus:border-[#f9e2af] font-mono shadow-inner text-lg" />
                    </div>
                    <MagneticButton onClick={calculateSleep} className="bg-[#f9e2af] text-[#1e1e2e] p-4 rounded-xl font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(249,226,175,0.4)] h-[60px] px-6">
                        Calculate
                    </MagneticButton>
                </div>
                
                <div className="mt-auto grid grid-cols-3 gap-3">
                    {cycles.length > 0 ? (
                        <>
                            <div className="bg-[#1e1e2e] p-4 rounded-2xl text-center border border-[#313244] hover:border-[#f38ba8] transition-colors group">
                                <div className="text-[10px] text-[#a6adc8] font-bold uppercase mb-1">4 Cycles (6h)</div>
                                <div className="font-black text-[#f38ba8] text-xl group-hover:scale-110 transition-transform">{cycles[0]}</div>
                            </div>
                            <div className="bg-[#1e1e2e] p-4 rounded-2xl text-center border border-[#313244] hover:border-[#89b4fa] transition-colors group scale-105 shadow-lg relative z-10">
                                <div className="text-[10px] text-[#a6adc8] font-bold uppercase mb-1">5 Cycles (7.5h)</div>
                                <div className="font-black text-[#89b4fa] text-2xl group-hover:scale-110 transition-transform">{cycles[1]}</div>
                            </div>
                            <div className="bg-[#1e1e2e] p-4 rounded-2xl text-center border border-[#313244] hover:border-[#a6e3a1] transition-colors group">
                                <div className="text-[10px] text-[#a6adc8] font-bold uppercase mb-1">6 Cycles (9h)</div>
                                <div className="font-black text-[#a6e3a1] text-xl group-hover:scale-110 transition-transform">{cycles[2]}</div>
                            </div>
                        </>
                    ) : <div className="col-span-3 text-center text-[#585b70] text-xs py-8 italic">Calculate optimal sleep windows...</div>}
                </div>
                <p className="text-[10px] text-[#585b70] text-center flex items-center justify-center gap-1"><Clock size={10} /> Calculation assumes 15m to fall asleep.</p>
            </div>
        </ToolCard>

        {/* TOOL 3: REGEX LAB */}
        <div className="md:col-span-2">
            <ToolCard title="Regex Laboratory" icon={Terminal} color="#a6e3a1">
            <div className="space-y-6">
                <div className="flex gap-6">
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-[#a6adc8] uppercase block mb-2 ml-1">Pattern</label>
                        <div className="relative">
                            <span className="absolute left-4 top-4 text-[#585b70] font-mono">/</span>
                            <input type="text" placeholder="^[a-z]+$" value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full bg-[#1e1e2e] p-4 pl-8 pr-4 rounded-xl text-[#f9e2af] font-mono border border-[#313244] outline-none focus:border-[#a6e3a1] text-lg shadow-inner" />
                            <span className="absolute right-4 top-4 text-[#585b70] font-mono">/g</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-[#a6adc8] uppercase block mb-2 ml-1">Test String</label>
                        <input type="text" placeholder="String to match..." value={testString} onChange={(e) => setTestString(e.target.value)} className="w-full bg-[#1e1e2e] p-4 rounded-xl text-white font-mono border border-[#313244] outline-none focus:border-[#89b4fa] text-lg shadow-inner" />
                    </div>
                </div>
                <div className={`p-6 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 ${regexMatch ? 'bg-[#a6e3a1]/10 border border-[#a6e3a1]/50 shadow-[0_0_20px_rgba(166,227,161,0.2)]' : 'bg-[#1e1e2e] border border-[#313244] text-[#585b70]'}`}>
                {regexMatch ? 
                    <><div className="w-3 h-3 rounded-full bg-[#a6e3a1] animate-pulse shadow-[0_0_10px_#a6e3a1]" /><span className="font-black text-[#a6e3a1] text-xl tracking-widest">MATCH FOUND</span></> : 
                    <><div className="w-3 h-3 rounded-full bg-[#f38ba8]" /><span className="font-bold tracking-widest text-sm">NO MATCH</span></>
                }
                </div>
            </div>
            </ToolCard>
        </div>

      </div>
    </div>
  );
}