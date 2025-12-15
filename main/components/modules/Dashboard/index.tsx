import React, { useEffect, useState, useRef } from 'react';
import { 
  Award, CheckSquare, Zap, Clock, TrendingUp, Calendar as CalIcon, 
  Brain, Droplets, Plus, Radio, MessageSquare, ArrowUpRight, 
  Battery, Minus, Activity
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { TiltCard } from '../../ui/TiltCard';
import { MagneticButton } from '../../ui/MagneticButton';

// --- INTERACTIVE BACKGROUND PARTICLES (HERO VARIANT) ---
const DashboardParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.clientWidth || 600;
    let height = canvas.height = canvas.parentElement?.clientHeight || 300;
    
    const mouse = { x: -1000, y: -1000 };
    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

    // Create more particles for the larger dashboard area
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse Repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = 150;

        if (dist < minDist) {
          const force = (minDist - dist) / minDist;
          p.x -= (dx / dist) * force * 5;
          p.y -= (dy / dist) * force * 5;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(137, 180, 250, ${0.3 + (dist < minDist ? 0.4 : 0)})`;
        ctx.fill();

        // Connect
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(137, 180, 250, ${0.1 * (1 - dist2 / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    window.addEventListener('resize', handleResize);
    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);
    
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60 z-0 mix-blend-screen" />;
};

// --- SUB-COMPONENTS ---

const StatWidget = ({ icon: Icon, label, value, subtext, color, trend }: any) => (
  <TiltCard className={`bg-[#252535]/80 backdrop-blur-md border border-[#313244] p-5 rounded-2xl relative overflow-hidden group hover:border-[${color}]/50 transition-all duration-300 h-full cursor-pointer`}>
    {/* Spotlight Gradient */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(400px_at_var(--x)_var(--y),rgba(137,180,250,0.1),transparent)] z-0 pointer-events-none" />
    
    {/* 3D Floating Icon */}
    <div className={`absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity text-[${color}] transform group-hover:scale-150 duration-700 ease-out`}>
      <Icon size={120} />
    </div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-2.5 rounded-xl bg-[#1e1e2e] text-[${color}] border border-[#313244] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
        <Icon size={20} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[#a6e3a1] text-xs font-bold bg-[#a6e3a1]/10 px-2 py-1 rounded-lg border border-[#a6e3a1]/20">
          <TrendingUp size={12} /> {trend}
        </div>
      )}
    </div>
    
    <div className="relative z-10 transform transition-transform duration-300 group-hover:translate-x-1">
      <div className="text-3xl font-black text-white tracking-tight mb-1 drop-shadow-md">{value}</div>
      <div className="text-xs text-[#a6adc8] font-bold uppercase tracking-wider">{label}</div>
      {subtext && <div className="text-[10px] text-[#585b70] mt-1 font-mono">{subtext}</div>}
    </div>
  </TiltCard>
);

const HydrationCore = ({ current, max, onAdd, onRemove }: any) => {
  const percentage = Math.min((current / max) * 100, 100);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liquidRotation, setLiquidRotation] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const rot = ((x / rect.width) - 0.5) * 20; 
    setLiquidRotation(-rot); 
  };

  return (
    <TiltCard className="bg-[#252535]/80 backdrop-blur-md border border-[#313244] p-6 rounded-2xl relative overflow-hidden h-full flex flex-col justify-between group hover:border-[#00f0ff]/30">
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Droplets className="text-[#00f0ff] animate-bounce" size={20} /> Bio-Fuel
          </h3>
          <p className="text-xs text-[#a6adc8]">Hydration Level</p>
        </div>
        <div className="text-2xl font-mono font-bold text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">{current}/{max}</div>
      </div>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setLiquidRotation(0)}
        className="relative flex-1 min-h-[120px] my-4 bg-[#1e1e2e] rounded-xl overflow-hidden border border-[#313244] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="text-4xl font-black text-white drop-shadow-xl mix-blend-overlay">{Math.round(percentage)}%</div>
        </div>
        
        <div 
            className="absolute inset-[-50%] transition-transform duration-300 ease-out origin-center will-change-transform"
            style={{ transform: `rotate(${liquidRotation}deg)` }}
        >
            <div 
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#00f0ff] to-[#00aadd] transition-all duration-700 ease-in-out opacity-90 shadow-[0_0_30px_#00f0ff]"
            style={{ height: `${percentage}%` }}
            >
            <div className="absolute top-0 left-0 w-[200%] h-6 bg-[#00f0ff] animate-[wave_3s_linear_infinite] translate-y-[-50%] opacity-100 rounded-[100%]" />
            </div>
            <div 
            className="absolute bottom-0 left-0 w-full bg-[#00f0ff] transition-all duration-1000 ease-in-out opacity-30 mix-blend-screen"
            style={{ height: `${percentage - 5}%` }}
            >
             <div className="absolute top-0 left-[-50%] w-[200%] h-8 bg-[#00f0ff] animate-[wave_5s_linear_infinite] translate-y-[-50%] rounded-[100%]" />
            </div>
        </div>
        
        <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-white rounded-full animate-[rise_4s_infinite] opacity-50" />
        <div className="absolute bottom-0 left-3/4 w-1 h-1 bg-white rounded-full animate-[rise_6s_infinite] opacity-30" />
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-white rounded-full animate-[rise_5s_infinite] opacity-40 delay-1000" />
      </div>

      <div className="flex gap-2 z-10">
        <MagneticButton onClick={onRemove} className="p-3 rounded-xl bg-[#1e1e2e] text-[#a6adc8] hover:text-[#f38ba8] hover:bg-[#f38ba8]/10 border border-[#313244] transition-colors flex-1 flex justify-center">
          <Minus size={18} />
        </MagneticButton>
        <MagneticButton onClick={onAdd} className="p-3 rounded-xl bg-[#00f0ff] text-[#1e1e2e] font-bold hover:bg-white shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex-[2] flex justify-center active:scale-95">
          <Plus size={18} className="mr-1" /> Intake
        </MagneticButton>
      </div>
    </TiltCard>
  );
};

const XPRing = ({ level, xp, nextXp }: any) => {
  const progress = Math.min((xp / nextXp) * 100, 100);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center group">
      <div className="absolute inset-0 rounded-full border-4 border-[#313244]/50 transform scale-110 group-hover:scale-125 transition-transform duration-500 opacity-50" />
      
      <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_10px_rgba(137,180,250,0.3)]">
        <circle cx="80" cy="80" r={radius} stroke="#313244" strokeWidth="8" fill="transparent" />
        <circle 
          cx="80" cy="80" r={radius} 
          stroke="url(#gradient)" 
          strokeWidth="8" 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#89b4fa" />
            <stop offset="100%" stopColor="#a6e3a1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
        <div className="text-xs font-bold text-[#a6adc8] uppercase tracking-widest">Level</div>
        <div className="text-5xl font-black text-white drop-shadow-md">{level}</div>
        <div className="text-[10px] font-mono text-[#89b4fa] mt-1 font-bold">{xp} / {nextXp} XP</div>
      </div>
    </div>
  );
};

export default function DashboardModule() {
  const { tasks, profile, updateHydration, notifications, socialMessages } = useApp();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingTasks = tasks.filter(t => !t.is_completed).length;
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const nextLevelXp = (profile?.level || 1) * 500;
  const hydration = profile?.hydration || { count: 0, daily_goal: 8 };

  const upcomingTasks = tasks
    .filter(t => !t.is_completed && t.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 3);

  const hour = time.getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 18) greeting = 'Good Afternoon';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TiltCard className="lg:col-span-2 bg-gradient-to-br from-[#1e1e2e] via-[#252535] to-[#1e1e2e] border border-[#313244] rounded-3xl p-8 relative overflow-hidden flex items-center shadow-2xl group">
          <DashboardParticles />
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#89b4fa] blur-[120px] opacity-10 group-hover:opacity-30 transition-opacity duration-700" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#a6e3a1] blur-[100px] opacity-5 group-hover:opacity-20 transition-opacity duration-700" />
          
          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1e2e]/80 border border-[#89b4fa]/30 text-[#89b4fa] text-xs font-bold mb-4 backdrop-blur-md shadow-lg animate-in slide-in-from-left duration-500">
              <Zap size={12} className="animate-pulse" /> SYSTEM ONLINE
            </div>
            <h1 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-xl animate-in slide-in-from-bottom-2 duration-500 delay-100">
              {greeting}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#89b4fa] via-[#cba6f7] to-[#a6e3a1] animate-gradient-x">
                {profile?.username || 'Engineer'}
              </span>
            </h1>
            <p className="text-[#a6adc8] max-w-md leading-relaxed animate-in slide-in-from-bottom-2 duration-500 delay-200">
              All systems nominal. You have <strong className="text-white bg-[#89b4fa]/10 px-1 rounded">{pendingTasks} active directives</strong> pending attention. 
              Maintain focus protocol.
            </p>
          </div>

          <div className="hidden sm:block relative z-10 animate-in zoom-in duration-700 delay-300">
            <XPRing level={profile?.level || 1} xp={profile?.xp || 0} nextXp={nextLevelXp} />
          </div>
        </TiltCard>

        <TiltCard className="bg-[#252535] border border-[#313244] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          
          <div className="absolute top-0 right-0 p-6 text-[#f9e2af] opacity-50 group-hover:opacity-100 transition-opacity">
            <Activity className="animate-spin-slow" size={32} />
          </div>
          
          <div className="z-10">
            <div className="text-sm font-bold text-[#a6adc8] uppercase tracking-widest flex items-center gap-2">
                <CalIcon size={14}/> {time.toLocaleDateString(undefined, { weekday: 'long' })}
            </div>
            <div className="text-5xl font-black text-white mt-2 font-mono tracking-tighter shadow-black drop-shadow-lg">
                {time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-[#585b70] font-mono mt-1 pl-1">
                :{time.getSeconds().toString().padStart(2, '0')} <span className="text-[10px] uppercase">sys.time</span>
            </div>
          </div>
          
          <div className="mt-8 z-10">
            <div className="flex items-center gap-2 text-sm text-[#cdd6f4] mb-2">
              <Battery size={16} className="text-[#a6e3a1] animate-pulse" /> Energy Output
            </div>
            <div className="w-full h-2 bg-[#1e1e2e] rounded-full overflow-hidden border border-[#313244]">
              <div className="h-full bg-gradient-to-r from-[#89b4fa] via-[#cba6f7] to-[#a6e3a1] w-[85%] animate-[shimmer_3s_infinite]" />
            </div>
          </div>
        </TiltCard>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ '--x': '0px', '--y': '0px' } as React.CSSProperties} onMouseMove={(e) => {
          const cards = e.currentTarget.children;
          for(const card of cards as any) {
              const rect = card.getBoundingClientRect();
              card.style.setProperty('--x', `${e.clientX - rect.left}px`);
              card.style.setProperty('--y', `${e.clientY - rect.top}px`);
          }
      }}>
        <StatWidget 
          icon={CheckSquare} 
          label="Pending Tasks" 
          value={pendingTasks} 
          subtext="Directives" 
          color="#89b4fa" 
        />
        <StatWidget 
          icon={Brain} 
          label="Productivity" 
          value={`${Math.round((completedTasks / (tasks.length || 1)) * 100)}%`} 
          subtext="Completion Rate" 
          color="#a6e3a1" 
          trend="+12%"
        />
        <StatWidget 
          icon={Zap} 
          label="Focus Streak" 
          value={profile?.streak || 0} 
          subtext="Days Active" 
          color="#f9e2af" 
        />
        <StatWidget 
          icon={Award} 
          label="Total XP" 
          value={(profile?.xp || 0).toLocaleString()} 
          subtext="Lifetime Merit" 
          color="#f38ba8" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[400px]">
        <TiltCard className="lg:col-span-2 bg-[#252535] border border-[#313244] rounded-3xl p-6 flex flex-col relative overflow-hidden shadow-xl">
          <div className="flex justify-between items-center mb-6 z-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Radio className="text-[#f38ba8] animate-pulse" /> Neural Uplink
            </h3>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f38ba8] animate-ping" />
                <div className="text-[10px] bg-[#1e1e2e] px-2 py-1 rounded text-[#585b70] border border-[#313244] uppercase font-bold">Live Feed</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 z-10">
            {[...notifications, ...socialMessages]
                .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 15)
                .map((item: any) => (
                  <div key={item.id} className="group flex gap-4 p-3 rounded-xl hover:bg-[#1e1e2e] border border-transparent hover:border-[#313244] transition-all cursor-default">
                    <div className="w-10 h-10 rounded-full bg-[#1e1e2e] border border-[#313244] flex items-center justify-center shrink-0 group-hover:border-[#89b4fa] group-hover:scale-110 transition-all">
                        {item.username ? <MessageSquare size={16} className="text-[#89b4fa]"/> : <Award size={16} className="text-[#f9e2af]"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-white truncate group-hover:text-[#89b4fa] transition-colors">{item.username ? `@${item.username}` : item.title || 'System Alert'}</span>
                        <span className="text-[10px] text-[#585b70] font-mono whitespace-nowrap">{new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-xs text-[#a6adc8] mt-0.5 truncate group-hover:text-[#cdd6f4] transition-colors">{item.content || item.message}</p>
                    </div>
                  </div>
            ))}
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#252535] to-transparent pointer-events-none z-20" />
        </TiltCard>

        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <HydrationCore 
                current={hydration.count} 
                max={hydration.daily_goal} 
                onAdd={() => updateHydration(1)} 
                onRemove={() => updateHydration(-1)} 
            />
          </div>

          <TiltCard className="bg-[#252535] border border-[#313244] rounded-3xl p-5 flex flex-col justify-center min-h-[140px] shadow-xl group hover:border-[#f38ba8]/30 transition-all cursor-pointer">
            <div className="absolute top-0 right-0 p-10 bg-[#f38ba8] blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity" />
            
            <h4 className="text-xs font-bold text-[#a6adc8] uppercase tracking-widest mb-3 flex items-center gap-2">
                <CalIcon size={12} className="text-[#f38ba8]" /> Imminent Deadline
            </h4>
            {upcomingTasks[0] ? (
                <div>
                    <div className="text-lg font-bold text-white line-clamp-1">{upcomingTasks[0].title}</div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-mono text-[#f38ba8] bg-[#f38ba8]/10 px-2 py-1 rounded border border-[#f38ba8]/20 flex items-center gap-1">
                            <Clock size={10} /> {new Date(upcomingTasks[0].due_date!).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-[#585b70] bg-[#1e1e2e] px-2 py-1 rounded border border-[#313244]">{upcomingTasks[0].priority} Priority</span>
                    </div>
                </div>
            ) : (
                <div className="text-[#585b70] text-sm italic flex items-center gap-2">
                    <CheckSquare size={16} /> No urgent tasks pending.
                </div>
            )}
            <div className="absolute top-4 right-4 text-[#313244] group-hover:text-[#f38ba8] transition-colors transform group-hover:rotate-45 duration-300">
                <ArrowUpRight size={24} />
            </div>
          </TiltCard>
        </div>
      </div>

      <style>{`
        @keyframes wave { 0% { transform: translateX(0) translateY(-50%) rotate(0deg); } 100% { transform: translateX(-50%) translateY(-50%) rotate(360deg); } }
        @keyframes rise { 0% { bottom: -10px; transform: translateX(0); } 50% { transform: translateX(10px); } 100% { bottom: 100%; transform: translateX(-10px); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 3s ease infinite; }
        @keyframes gradient-x { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
      `}</style>
    </div>
  );
}