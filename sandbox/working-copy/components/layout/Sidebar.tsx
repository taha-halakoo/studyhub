import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, CheckSquare, Clock, BookOpen, 
  Calculator, Settings, LogOut, Calendar, Brain, Activity,
  ShoppingBag, Trophy, Wind, PenTool, Book, PieChart, ChevronLeft, ChevronRight,
  Target, Library, Users, BarChart2, FileText, Zap, MessageSquare, Sword, Crosshair,
  Terminal, Newspaper, Palette, Folder, BookMarked, Glasses, CalendarClock, GraduationCap,
  Hexagon, ChevronDown, Box
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TiltCard } from '../ui/TiltCard';
import { MagneticButton } from '../ui/MagneticButton';

type NavGroup = {
  id: string;
  title: string;
  items: { id: string; label: string; icon: any }[];
};

const getNavGroups = (t: (key: string) => string): NavGroup[] => [
  {
    id: 'nexus',
    title: "NEXUS",
    items: [
      { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
      { id: 'aichat', label: t('aiChat'), icon: MessageSquare },
      { id: 'analytics', label: t('analytics'), icon: PieChart },
      { id: 'calendar', label: t('timeline'), icon: Calendar },
    ]
  },
  {
    id: 'protocol',
    title: "PROTOCOL",
    items: [
      { id: 'tasks', label: t('tasks'), icon: CheckSquare },
      { id: 'projects', label: 'Projects', icon: Folder },
      { id: 'goals', label: t('strategicMap'), icon: Target },
      { id: 'scheduler', label: t('scheduler'), icon: CalendarClock },
    ]
  },
  {
    id: 'academy',
    title: "ACADEMY",
    items: [
      { id: 'gradebook', label: t('gradebook'), icon: GraduationCap },
      { id: 'notes', label: t('vault'), icon: BookOpen },
      { id: 'flashcards', label: t('neuralCards'), icon: Brain },
      { id: 'reader', label: 'Study Mode', icon: Glasses },
      { id: 'quiz', label: t('quiz'), icon: Zap },
      { id: 'bibliography', label: 'References', icon: BookMarked },
      { id: 'resources', label: t('library'), icon: Library },
    ]
  },
  {
    id: 'forge',
    title: "FORGE",
    items: [
      { id: 'canvas', label: t('canvas'), icon: PenTool },
      { id: 'codelab', label: t('codeLab'), icon: Terminal },
      { id: 'themestudio', label: t('themeStudio'), icon: Palette },
      { id: 'tools', label: t('toolkit'), icon: Calculator },
    ]
  },
  {
    id: 'vitality',
    title: "VITALITY",
    items: [
      { id: 'focus', label: t('focusLab'), icon: Clock },
      { id: 'journal', label: t('journal'), icon: Book },
      { id: 'breathwork', label: t('bioSync'), icon: Wind },
      { id: 'habits', label: t('habits'), icon: Activity },
    ]
  },
  {
    id: 'uplink',
    title: "UPLINK",
    items: [
      { id: 'news', label: 'Global News', icon: Newspaper },
      { id: 'social', label: t('social'), icon: Users },
      { id: 'leaderboard', label: t('leaderboard'), icon: BarChart2 },
    ]
  },
  {
    id: 'prestige',
    title: "PRESTIGE",
    items: [
      { id: 'quests', label: 'Daily Quests', icon: Crosshair },
      { id: 'skills', label: 'Skill Tree', icon: Sword },
      { id: 'achievements', label: t('records'), icon: Trophy },
      { id: 'shop', label: t('marketplace'), icon: ShoppingBag },
      { id: 'resume', label: t('resume'), icon: FileText },
    ]
  },
  {
    id: 'core',
    title: "CORE",
    items: [
      { id: 'settings', label: t('system'), icon: Settings },
    ]
  }
];

const SidebarParticles = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.clientWidth || 300;
    let height = canvas.height = canvas.parentElement?.clientHeight || 800;
    
    const mouse = { x: -1000, y: -1000 };
    
    const particleCount = isCollapsed ? 20 : 60;
    const connectionDistance = 100;
    const mouseDistance = 150;
    
    const particles: { x: number; y: number; vx: number; vy: number; size: number, pulse: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.05;

        const currentSize = p.size + Math.sin(p.pulse) * 0.5;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouseDistance) {
          const force = (mouseDistance - distMouse) / mouseDistance;
          const directionX = (dxMouse / distMouse) * force * 3;
          const directionY = (dyMouse / distMouse) * force * 3;
          p.x -= directionX;
          p.y -= directionY;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, currentSize), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(137, 180, 250, ${0.4 + (distMouse < mouseDistance ? 0.4 : 0)})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(137, 180, 250, ${0.1 * (1 - dist / connectionDistance)})`;
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

    const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; }

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
  }, [isCollapsed]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40 z-0" />;
};

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const { profile, signOut, translate } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  
  const xpRequired = (profile?.level || 1) * 500;
  const progressPercent = Math.min(((profile?.xp || 0) / xpRequired) * 100, 100);
  const navGroups = getNavGroups(translate);

  const handleGroupClick = (groupId: string) => {
    if (isCollapsed) return;
    setOpenGroupId(prev => prev === groupId ? null : groupId);
  };

  return (
    <aside 
      className={`
        relative flex flex-col h-full shrink-0 z-20 
        transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        bg-[#1e1e2e] border-r border-[#313244]/50 shadow-[5px_0_30px_rgba(0,0,0,0.3)]
        ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e1e2e] via-[#181825] to-[#1e1e2e] z-0"></div>
      <SidebarParticles isCollapsed={isCollapsed} />
      <div className="absolute inset-0 bg-[#1e1e2e]/60 backdrop-blur-[2px] z-0 pointer-events-none"></div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-[#252535] border border-[#313244] text-[#89b4fa] rounded-full p-1.5 z-50 hover:bg-[#89b4fa] hover:text-[#1e1e2e] hover:scale-110 transition-all shadow-lg"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Area */}
      <div className={`relative z-10 flex items-center h-24 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-6 space-x-4'}`}>
        <div className="relative group shrink-0 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <div className="absolute inset-0 bg-[#89b4fa] blur-[20px] opacity-20 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow"></div>
          <div className="relative w-10 h-10 bg-gradient-to-br from-[#252535] to-[#181825] border border-[#313244] rounded-xl flex items-center justify-center text-[#89b4fa] shadow-xl group-hover:scale-110 group-hover:rotate-180 transition-all duration-500 ease-out">
            <Hexagon size={24} />
            <div className="absolute inset-0 flex items-center justify-center font-black text-lg">S</div>
          </div>
        </div>
        <div className={`overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <span className="text-xl font-black tracking-[0.2em] text-white whitespace-nowrap drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">STUDYHUB</span>
          <div className="text-[10px] text-[#a6adc8] font-mono tracking-wide uppercase">Ultimate OS v20.0</div>
        </div>
      </div>

      {/* Profile Card (Interactive) */}
      <div className={`relative z-10 transition-all duration-500 ${isCollapsed ? 'px-2 mb-4' : 'px-6 mb-6'}`}>
        <div onClick={() => setActiveView('profile')}>
            <TiltCard disabled={isCollapsed} className={`relative overflow-hidden rounded-2xl border border-[#313244] bg-[#252535]/80 backdrop-blur-md shadow-2xl group cursor-pointer ${isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-4'}`}>
            {!isCollapsed && (
                <div className="absolute bottom-0 left-0 h-1 bg-[#313244] w-full">
                <div className="h-full bg-gradient-to-r from-[#89b4fa] to-[#a6e3a1] shadow-[0_0_10px_#89b4fa]" style={{ width: `${progressPercent}%` }} />
                </div>
            )}
            <div className={`flex items-center ${isCollapsed ? 'flex-col justify-center' : 'space-x-3'}`}>
                <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#89b4fa] to-[#a6e3a1] flex items-center justify-center font-black text-[#1e1e2e] shadow-lg transform group-hover:rotate-12 transition-transform duration-300">{profile?.level || 1}</div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#a6e3a1] border-2 border-[#1e1e2e] rounded-full animate-pulse shadow-[0_0_8px_#a6e3a1]" title="Online"></div>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
                <div className="font-bold text-white truncate text-sm group-hover:text-[#89b4fa] transition-colors">{profile?.username || 'Engineer'}</div>
                <div className="text-[10px] text-[#a6adc8] truncate font-mono">{profile?.title || 'Operative'}</div>
                </div>
            </div>
            {isCollapsed && <div className="w-full h-1 bg-[#313244] rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#89b4fa]" style={{ width: `${progressPercent}%` }} /></div>}
            </TiltCard>
        </div>
      </div>

      {/* Navigation (Accordion) */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar relative z-10 py-2 pb-8">
        {navGroups.map((group, index) => {
          const isOpen = isCollapsed ? true : openGroupId === group.id;

          return (
            <div key={group.id} className="space-y-1">
              
              {/* Accordion Header */}
              <div 
                onClick={() => handleGroupClick(group.id)}
                className={`
                  px-3 py-2 flex items-center justify-between cursor-pointer group/header
                  transition-all duration-300 select-none
                  ${isCollapsed ? 'hidden' : 'block'}
                `}
              >
                <div className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isOpen ? 'text-[#89b4fa] drop-shadow-[0_0_5px_rgba(137,180,250,0.5)]' : 'text-[#585b70] group-hover/header:text-white'}`}>
                  {group.title}
                </div>
                <ChevronDown size={12} className={`text-[#585b70] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#89b4fa]' : 'rotate-0'}`} />
              </div>
              
              {/* Divider for Collapsed Mode */}
              {isCollapsed && index > 0 && <div className="h-px w-8 mx-auto bg-[#313244] my-3 opacity-50" />}

              {/* Expandable Items */}
              <div className={`space-y-1 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`}>
                {group.items.map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <MagneticButton
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      title={isCollapsed ? item.label : ''}
                      className={`
                        group relative w-full flex items-center py-2.5 rounded-xl transition-all duration-200 ease-out overflow-visible
                        ${isCollapsed ? 'justify-center px-0' : 'px-4 space-x-3'}
                        ${isActive 
                          ? 'bg-[#89b4fa]/10 text-white shadow-[inset_0_0_20px_rgba(137,180,250,0.05)] border border-[#89b4fa]/20' 
                          : 'text-[#a6adc8] hover:text-white hover:bg-[#313244]/50 border border-transparent'
                        }
                      `}
                    >
                      {/* Holographic Active Marker */}
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 transition-all duration-300 ${isActive ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}>
                         <div className="w-1 h-full bg-[#89b4fa] rounded-r-full shadow-[0_0_15px_#89b4fa]" />
                      </div>

                      {/* Icon with 3D Flip */}
                      <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-[#89b4fa]' : 'group-hover:scale-110 group-hover:text-[#cdd6f4] group-hover:rotate-y-180'}`} style={{ transformStyle: 'preserve-3d' }}>
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        {isActive && !isCollapsed && (
                            <div className="absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <Box size={10} className="text-[#89b4fa] animate-spin-slow" />
                            </div>
                        )}
                      </div>

                      <span className={`relative z-10 font-medium text-sm whitespace-nowrap transition-all duration-500 ${isCollapsed ? 'opacity-0 w-0 translate-x-10 absolute' : 'opacity-100 w-auto translate-x-0'}`}>
                        {item.label}
                      </span>

                      {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#89b4fa]/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite] rounded-xl pointer-events-none" />}
                    </MagneticButton>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#313244]/50 relative z-10 bg-[#1e1e2e]/80 backdrop-blur-sm">
        <MagneticButton onClick={signOut} className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-300 group border border-transparent hover:border-[#f38ba8]/30 hover:bg-[#f38ba8]/10 hover:shadow-[0_0_15px_rgba(243,139,168,0.2)] ${isCollapsed ? '' : 'space-x-2'}`} title={translate('terminate')}>
          <LogOut size={18} className="text-[#f38ba8] transition-transform group-hover:-translate-x-1 group-hover:scale-110" />
          <span className={`font-bold text-sm text-[#f38ba8] overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>{translate('terminate')}</span>
        </MagneticButton>
      </div>
      
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </aside>
  );
};