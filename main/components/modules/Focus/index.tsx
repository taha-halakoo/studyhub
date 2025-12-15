import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Zap, Volume2, VolumeX, Music, Tv, CheckCircle, Clock, Infinity, Activity, Settings, Plus, Save, Trash2, X } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

const AMBIENCE_TRACKS = [
  { id: 'none', label: 'Silence', url: '' },
  { id: 'rain', label: 'Cyber Rain', url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_8217a94420.mp3?filename=heavy-rain-105260.mp3' },
  { id: 'white', label: 'White Noise', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3?filename=white-noise-8117.mp3' },
  { id: 'cafe', label: 'Night Cafe', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=cafe-ambience-15638.mp3' },
];

interface TimerPreset {
  id: string;
  label: string;
  duration: number; // minutes
  type: 'focus' | 'break';
}

const DEFAULT_PRESETS: TimerPreset[] = [
  { id: 'pomo', label: 'Pomodoro', duration: 25, type: 'focus' },
  { id: 'deep', label: 'Deep Work', duration: 50, type: 'focus' },
  { id: 'short', label: 'Short Break', duration: 5, type: 'break' },
  { id: 'long', label: 'Long Break', duration: 15, type: 'break' },
];

// --- 3D PARTICLE SYSTEM (FLOW STATE) ---
const FlowParticles = ({ active }: { active: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions based on parent container
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }

        const particles: any[] = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const animate = () => {
            if (!active) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }
            
            // Fade out trail using destination-out to maintain transparency
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';

            // Spawn
            if (particles.length < 100) {
                particles.push({
                    x: centerX, y: centerY,
                    angle: Math.random() * Math.PI * 2,
                    speed: Math.random() * 3 + 1,
                    size: Math.random() * 3,
                    color: Math.random() > 0.5 ? '#89b4fa' : '#a6e3a1',
                    life: 1
                });
            }

            // Update & Draw
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.size *= 0.96; // Shrink
                p.life -= 0.02;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.fill();
                ctx.globalAlpha = 1;

                if (p.size < 0.2 || p.life <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animate);
        };
        const id = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(id);
    }, [active]);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none rounded-3xl" />;
};

export default function FocusModule() {
  const { addXp, logFocusSession } = useApp();
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string>('pomo');
  const [presets, setPresets] = useState<TimerPreset[]>(() => {
    const saved = localStorage.getItem('studyhub_timer_presets');
    return saved ? JSON.parse(saved) : DEFAULT_PRESETS;
  });

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetTime, setNewPresetTime] = useState(25);
  const [newPresetType, setNewPresetType] = useState<'focus' | 'break'>('focus');
  const [showVisualizer, setShowVisualizer] = useState(false);
  
  // Audio State
  const [selectedTrack, setSelectedTrack] = useState(AMBIENCE_TRACKS[0]);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activePreset = presets.find(p => p.id === activePresetId) || presets[0];

  // Load preset time when preset changes (if timer not active)
  useEffect(() => {
    if (!isActive) {
        setTimeLeft(activePreset.duration * 60);
    }
  }, [activePreset, isActive]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      
      if (activePreset.type === 'focus') {
          addXp(activePreset.duration * 2); // 2 XP per minute
          logFocusSession(activePreset.duration, 'pomo');
      }
      
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, activePreset]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isActive && selectedTrack.url) {
        audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed)", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isActive, selectedTrack, volume]);

  const savePreset = () => {
      if (!newPresetName || newPresetTime <= 0) return;
      const newPreset: TimerPreset = {
          id: Date.now().toString(),
          label: newPresetName,
          duration: newPresetTime,
          type: newPresetType
      };
      const updatedPresets = [...presets, newPreset];
      setPresets(updatedPresets);
      localStorage.setItem('studyhub_timer_presets', JSON.stringify(updatedPresets));
      setNewPresetName('');
      setNewPresetTime(25);
      setShowSettings(false);
  };

  const deletePreset = (id: string) => {
      const updated = presets.filter(p => p.id !== id);
      setPresets(updated);
      localStorage.setItem('studyhub_timer_presets', JSON.stringify(updated));
      if (activePresetId === id) setActivePresetId(updated[0]?.id || '');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(activePreset.duration * 60); };
  
  const totalTime = activePreset.duration * 60;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const color = activePreset.type === 'focus' ? '#89b4fa' : '#a6e3a1';

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in pb-12">
      
      {/* LEFT: TIMER */}
      <TiltCard className="lg:col-span-2 flex flex-col items-center justify-center space-y-8 relative overflow-hidden rounded-3xl bg-[#1e1e2e] border border-[#313244] shadow-2xl group transition-all">
        
        {/* Visualizer Overlay */}
        {showVisualizer && (
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen transition-opacity duration-1000">
            <iframe 
              width="100%" height="100%" 
              src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=0&loop=1&playlist=jfKfPfyJRdk" 
              title="Lofi" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
              className="pointer-events-none"
            />
          </div>
        )}

        <div className="absolute top-0 right-0 w-96 h-96 bg-[#89b4fa] blur-[150px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" />

        <div className="text-center space-y-4 z-10 w-full px-8 flex justify-between items-start">
            <div className="flex flex-col items-start">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-[#89b4fa]/20 border-[#89b4fa] text-[#89b4fa] shadow-[0_0_15px_rgba(137,180,250,0.3)] animate-pulse' : 'bg-[#313244] border-[#45475a] text-[#585b70]'}`}>
                    <Infinity size={14} className={isActive ? "animate-spin-slow" : ""} />
                    {isActive ? "Flow State Engaged" : "System Idle"}
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-2xl mt-2">Focus Protocol</h1>
            </div>
            
            <MagneticButton onClick={() => setShowSettings(!showSettings)} className="p-3 rounded-xl bg-[#252535] text-[#a6adc8] border border-[#313244] hover:text-white hover:border-[#89b4fa] transition-all">
                <Settings size={20} className={showSettings ? "animate-spin-slow" : ""} />
            </MagneticButton>
        </div>

        {/* SETTINGS PANEL OVERLAY */}
        {showSettings && (
            <div className="absolute inset-0 z-50 bg-[#1e1e2e]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-white">Configure Timer</h2>
                        <button onClick={() => setShowSettings(false)} className="text-[#f38ba8] hover:bg-[#f38ba8]/10 p-2 rounded-lg"><X /></button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[#a6adc8] uppercase mb-1 block">Preset Name</label>
                            <input value={newPresetName} onChange={e => setNewPresetName(e.target.value)} className="w-full bg-[#252535] p-3 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa]" placeholder="e.g. 90m Grind" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-[#a6adc8] uppercase mb-1 block">Duration (Min)</label>
                                <input type="number" value={newPresetTime} onChange={e => setNewPresetTime(parseInt(e.target.value))} className="w-full bg-[#252535] p-3 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa]" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-[#a6adc8] uppercase mb-1 block">Type</label>
                                <div className="flex bg-[#252535] p-1 rounded-xl border border-[#313244]">
                                    <button onClick={() => setNewPresetType('focus')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${newPresetType === 'focus' ? 'bg-[#89b4fa] text-[#1e1e2e]' : 'text-[#a6adc8]'}`}>Focus</button>
                                    <button onClick={() => setNewPresetType('break')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${newPresetType === 'break' ? 'bg-[#a6e3a1] text-[#1e1e2e]' : 'text-[#a6adc8]'}`}>Break</button>
                                </div>
                            </div>
                        </div>
                        <MagneticButton onClick={savePreset} className="w-full bg-[#89b4fa] text-[#1e1e2e] py-3 rounded-xl font-bold hover:bg-white transition-all flex items-center justify-center gap-2">
                            <Save size={18} /> Save Preset
                        </MagneticButton>
                    </div>

                    <div className="border-t border-[#313244] pt-4">
                        <label className="text-xs font-bold text-[#a6adc8] uppercase mb-3 block">Saved Presets</label>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                            {presets.map(p => (
                                <div key={p.id} className="flex items-center gap-2 bg-[#252535] px-3 py-2 rounded-lg border border-[#313244]">
                                    <span className="text-sm text-white">{p.label} <span className="text-[#a6adc8] text-xs">({p.duration}m)</span></span>
                                    {!DEFAULT_PRESETS.find(dp => dp.id === p.id) && (
                                        <button onClick={() => deletePreset(p.id)} className="text-[#f38ba8] hover:text-white"><Trash2 size={12} /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* 3D TIMER VISUALIZATION */}
        <div className="relative w-96 h-96 flex items-center justify-center z-10 perspective-1000">
          <FlowParticles active={isActive} />
          
          {/* Outer Ring 1 (Rotating) */}
          <div className={`absolute inset-0 rounded-full border-[1px] border-[#313244] w-full h-full animate-[spin_20s_linear_infinite] opacity-30 ${isActive ? `border-[${color}]/30` : ''}`} />
          
          {/* Outer Ring 2 (Counter-Rotating) */}
          <div className={`absolute inset-4 rounded-full border-[1px] border-dashed border-[#313244] w-[90%] h-[90%] animate-[spin_30s_linear_infinite_reverse] opacity-20 ${isActive ? `border-[${color}]/30` : ''}`} style={{left: '5%', top: '5%'}} />

          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_25px_rgba(137,180,250,0.4)]">
            <circle 
                cx="192" cy="192" r="160" 
                stroke={color} 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={1005} 
                strokeDashoffset={1005 - (1005 * progress) / 100} 
                strokeLinecap="round" 
                className="transition-all duration-1000 ease-linear" 
            />
          </svg>
          
          <div className="text-center z-10 flex flex-col items-center">
            <div className={`text-8xl font-mono font-black text-white tracking-tighter tabular-nums drop-shadow-2xl transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className={`text-[#a6adc8] font-bold mt-4 uppercase tracking-[0.3em] text-sm transition-opacity ${isActive ? 'animate-pulse' : ''}`} style={{ color: isActive ? color : '#a6adc8' }}>
              {activePreset.label}
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col gap-6 w-full max-w-sm z-10 px-6">
          <div className="flex gap-4">
            <MagneticButton 
                onClick={toggleTimer} 
                className={`flex-1 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-105 active:scale-95 ${isActive ? 'bg-[#313244] text-white border border-[#f38ba8] hover:bg-[#f38ba8] hover:text-[#1e1e2e]' : 'bg-[#89b4fa] text-[#1e1e2e] hover:bg-white shadow-[0_0_30px_rgba(137,180,250,0.3)]'}`}
            >
              {isActive ? <><Pause size={24} /> ABORT</> : <><Play size={24} /> INITIALIZE</>}
            </MagneticButton>
            <MagneticButton onClick={resetTimer} className="w-20 flex items-center justify-center rounded-2xl bg-[#252535] border border-[#313244] text-[#a6adc8] hover:text-white hover:bg-[#313244]/80 transition-all">
                <RefreshCw size={24} />
            </MagneticButton>
          </div>
          
          {/* Preset Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {presets.map(preset => (
                <button 
                    key={preset.id}
                    onClick={() => { setActivePresetId(preset.id); setIsActive(false); setTimeLeft(preset.duration * 60); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                        activePresetId === preset.id 
                        ? `bg-[${preset.type === 'focus' ? '#89b4fa' : '#a6e3a1'}]/20 text-[${preset.type === 'focus' ? '#89b4fa' : '#a6e3a1'}] border-[${preset.type === 'focus' ? '#89b4fa' : '#a6e3a1'}]` 
                        : 'bg-[#252535] text-[#a6adc8] border-[#313244] hover:text-white'
                    }`}
                >
                    {preset.label} ({preset.duration}m)
                </button>
            ))}
            <button onClick={() => setShowSettings(true)} className="px-3 py-2 rounded-xl bg-[#252535] border border-[#313244] text-[#a6adc8] hover:text-white hover:border-[#89b4fa] transition-all">
                <Plus size={14} />
            </button>
          </div>
        </div>
      </TiltCard>

      {/* RIGHT: AMBIENCE MIXER */}
      <TiltCard className="bg-[#252535]/80 backdrop-blur-xl border border-[#313244] rounded-3xl p-8 shadow-2xl flex flex-col gap-8 h-full">
        <div className="flex items-center gap-3 text-white border-b border-[#313244] pb-6">
          <div className="p-3 bg-[#1e1e2e] rounded-xl border border-[#313244] text-[#f9e2af] shadow-lg animate-[bounce_2s_infinite]">
            <Music size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black">Sonic Environment</h2>
            <p className="text-xs text-[#a6adc8]">Background Audio Layer</p>
          </div>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
          {AMBIENCE_TRACKS.map(track => (
            <div 
                key={track.id} 
                onClick={() => setSelectedTrack(track)} 
                className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer group hover:translate-x-1
                    ${selectedTrack.id === track.id 
                        ? 'bg-[#1e1e2e] border border-[#89b4fa] text-white shadow-[0_0_15px_rgba(137,180,250,0.1)]' 
                        : 'bg-[#252535] border border-transparent hover:bg-[#1e1e2e] hover:border-[#313244]'
                    }
                `}
            >
              <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${selectedTrack.id === track.id ? 'bg-[#89b4fa] shadow-[0_0_5px_#89b4fa]' : 'bg-[#313244]'}`} />
                  <span className="font-medium text-sm">{track.label}</span>
              </div>
              {selectedTrack.id === track.id && isActive && (
                  <div className="flex gap-1 items-end h-4">
                      <div className="w-1 bg-[#89b4fa] animate-[bounce_1s_infinite] h-full" />
                      <div className="w-1 bg-[#89b4fa] animate-[bounce_1.2s_infinite] h-2/3" />
                      <div className="w-1 bg-[#89b4fa] animate-[bounce_0.8s_infinite] h-full" />
                  </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#1e1e2e] p-6 rounded-2xl border border-[#313244] space-y-6 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
          
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-[#a6adc8] uppercase tracking-widest">Output Level</span>
            {volume === 0 ? <VolumeX size={16} className="text-[#585b70]" /> : <Volume2 size={16} className="text-[#89b4fa]" />}
          </div>
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-2 bg-[#313244] rounded-lg appearance-none cursor-pointer accent-[#89b4fa] relative z-10" />
          
          <div className="pt-4 border-t border-[#313244] relative z-10">
             <MagneticButton onClick={() => setShowVisualizer(!showVisualizer)} className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl transition-colors font-bold text-xs uppercase tracking-wider ${showVisualizer ? 'text-[#a6e3a1] bg-[#a6e3a1]/10 border border-[#a6e3a1]/20' : 'text-[#a6adc8] hover:text-white bg-[#252535]'}`}>
                <Tv size={16} /> <span>{showVisualizer ? 'Visualizer Active' : 'Enable Visualizer'}</span>
             </MagneticButton>
          </div>
        </div>

        <audio ref={audioRef} src={selectedTrack.url} loop />
      </TiltCard>
      
      <style>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .animate-spin-slow { animation: spin 8s linear infinite; }
      `}</style>
    </div>
  );
}