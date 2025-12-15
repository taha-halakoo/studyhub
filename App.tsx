import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { supabase } from './lib/supabase';
import { 
  Lock, ArrowRight, Menu, Command, Info, ShieldCheck, Key, 
  UserPlus, Mail 
} from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { Oracle } from './components/ui/Oracle';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { InstallPrompt } from './components/ui/InstallPrompt';
import { MediaPlayer } from './components/ui/MediaPlayer';
import { NotificationCenter } from './components/ui/NotificationCenter';
import { ShortcutsModal } from './components/ui/ShortcutsModal';
import { OnboardingTour } from './components/ui/OnboardingTour';
import { ChangelogModal } from './components/ui/ChangelogModal';
import { BackgroundParticles } from './components/ui/BackgroundParticles';
import { TiltCard } from './components/ui/TiltCard';
import { MagneticButton } from './components/ui/MagneticButton';
import { NetworkBlocker } from './components/ui/NetworkBlocker';

const DashboardModule = lazy(() => import('./components/modules/Dashboard'));
const TasksModule = lazy(() => import('./components/modules/Tasks'));
const FocusModule = lazy(() => import('./components/modules/Focus'));
const NotesModule = lazy(() => import('./components/modules/Notes'));
const ToolsModule = lazy(() => import('./components/modules/Tools'));
const FlashcardsModule = lazy(() => import('./components/modules/Flashcards'));
const CalendarModule = lazy(() => import('./components/modules/Calendar'));
const SettingsModule = lazy(() => import('./components/modules/Settings'));
const HabitsModule = lazy(() => import('./components/modules/Habits'));
const ShopModule = lazy(() => import('./components/modules/Shop'));
const AchievementsModule = lazy(() => import('./components/modules/Achievements'));
const BreathworkModule = lazy(() => import('./components/modules/Breathwork'));
const CanvasModule = lazy(() => import('./components/modules/Canvas'));
const JournalModule = lazy(() => import('./components/modules/Journal'));
const AnalyticsModule = lazy(() => import('./components/modules/Analytics'));
const GoalsModule = lazy(() => import('./components/modules/Goals'));
const ResourcesModule = lazy(() => import('./components/modules/Resources'));
const LeaderboardModule = lazy(() => import('./components/modules/Leaderboard'));
const SocialModule = lazy(() => import('./components/modules/Social'));
const QuizModule = lazy(() => import('./components/modules/Quiz'));
const ResumeModule = lazy(() => import('./components/modules/Resume'));
const ChatModule = lazy(() => import('./components/modules/Chat'));
const SkillsModule = lazy(() => import('./components/modules/Skills'));
const QuestsModule = lazy(() => import('./components/modules/Quests'));
const CodeLabModule = lazy(() => import('./components/modules/CodeLab'));
const NewsModule = lazy(() => import('./components/modules/News'));
const ThemeForgeModule = lazy(() => import('./components/modules/ThemeForge'));
const ProjectsModule = lazy(() => import('./components/modules/Projects'));
const BibliographyModule = lazy(() => import('./components/modules/Bibliography'));
const ReaderModule = lazy(() => import('./components/modules/Reader'));
const SchedulerModule = lazy(() => import('./components/modules/Scheduler'));
const ExamModeModule = lazy(() => import('./components/modules/ExamMode'));
const GradebookModule = lazy(() => import('./components/modules/Gradebook'));
const ProfileModule = lazy(() => import('./components/modules/Profile'));

interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

const ToastContainer = () => {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast: ToastItem) => (
        <div key={toast.id} className={`min-w-[200px] p-4 rounded-xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-right fade-in duration-300 ${toast.type === 'success' ? 'bg-[#a6e3a1]/10 border-[#a6e3a1] text-[#a6e3a1]' : ''} ${toast.type === 'error' ? 'bg-[#f38ba8]/10 border-[#f38ba8] text-[#f38ba8]' : ''} ${toast.type === 'info' ? 'bg-[#89b4fa]/10 border-[#89b4fa] text-[#89b4fa]' : ''}`}>
          <div className="font-bold text-sm">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};

const AuthScreen = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username || `User-${Math.floor(Math.random()*1000)}` }
          }
        });
        if (error) throw error;
        alert("Registration successful! Check your email for the confirmation link.");
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1e1e2e] text-white relative overflow-hidden">
      <BackgroundParticles />
      <NetworkBlocker />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

      <TiltCard className="w-full max-w-md bg-[#252535]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#313244] shadow-2xl relative z-10 animate-fade-in">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#89b4fa] blur-[100px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a6e3a1] blur-[100px] opacity-10 pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#89b4fa] to-[#a6e3a1] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3 group hover:rotate-12 transition-transform duration-500">
            {mode === 'login' ? <Lock size={32} className="text-[#1e1e2e]" /> : <UserPlus size={32} className="text-[#1e1e2e]" />}
          </div>
          <h1 className="text-3xl font-black tracking-tight">StudyHub OS</h1>
          <p className="text-[#a6adc8] text-xs font-bold uppercase tracking-widest mt-2">
            {mode === 'login' ? 'Secure Access Terminal' : 'New Operative Registration'}
          </p>
        </div>

        {error && (
          <div className="bg-[#f38ba8]/10 border border-[#f38ba8]/30 text-[#f38ba8] p-3 rounded-xl text-center text-sm mb-6 animate-pulse font-bold flex items-center justify-center gap-2">
            <ShieldCheck size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          {mode === 'signup' && (
            <div className="group">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Codename (Username)" 
                  className="w-full bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3.5 pl-10 text-white outline-none focus:border-[#89b4fa] transition-all shadow-inner placeholder-[#585b70]"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <ShieldCheck size={18} className="absolute left-3 top-3.5 text-[#585b70] group-focus-within:text-[#89b4fa] transition-colors" />
              </div>
            </div>
          )}

          <div className="group">
            <div className="relative">
              <input 
                type="email" 
                placeholder="Identity (Email)" 
                required 
                className="w-full bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3.5 pl-10 text-white outline-none focus:border-[#89b4fa] transition-all shadow-inner placeholder-[#585b70]"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Mail size={18} className="absolute left-3 top-3.5 text-[#585b70] group-focus-within:text-[#89b4fa] transition-colors" />
            </div>
          </div>

          <div className="group">
            <div className="relative">
              <input 
                type="password" 
                placeholder="Passcode" 
                required 
                className="w-full bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3.5 pl-10 text-white outline-none focus:border-[#89b4fa] transition-all shadow-inner placeholder-[#585b70]"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Key size={18} className="absolute left-3 top-3.5 text-[#585b70] group-focus-within:text-[#89b4fa] transition-colors" />
            </div>
          </div>

          <MagneticButton 
            disabled={loading} 
            className="w-full bg-[#89b4fa] hover:bg-white text-[#1e1e2e] font-black py-4 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(137,180,250,0.3)] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Initialize Session' : 'Create Credentials')} 
            {!loading && <ArrowRight size={18} />}
          </MagneticButton>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            className="text-xs font-bold text-[#a6adc8] hover:text-white uppercase tracking-wider transition-colors"
          >
            {mode === 'login' ? "Don't have an ID? Register" : "Already have access? Login"}
          </button>
        </div>
      </TiltCard>
    </div>
  );
};

const StudyHubShell = () => {
  const { user, profile, isLoading, debugLogs } = useApp();
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isOracleOpen, setIsOracleOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsOracleOpen(prev => !prev); }
        if (e.key === '?') { e.preventDefault(); setShowShortcuts(prev => !prev); }
    };
    window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (profile?.active_theme === 'cyber') {
      document.documentElement.style.setProperty('--accent-blue', '#00f0ff');
      document.documentElement.style.setProperty('--bg-dark', '#050510');
    } else if (profile?.active_theme === 'zen') {
      document.documentElement.style.setProperty('--accent-blue', '#94e2d5');
      document.documentElement.style.setProperty('--bg-dark', '#1e201e');
    } else {
      document.documentElement.style.removeProperty('--accent-blue');
      document.documentElement.style.removeProperty('--bg-dark');
    }
  }, [profile?.active_theme]);

  if (isLoading) return <LoadingScreen logs={debugLogs} />;
  if (!user) return <AuthScreen />;

  return (
    <div className="flex h-screen w-full text-white overflow-hidden font-sans transition-colors duration-500 relative">
      <BackgroundParticles />
      <NetworkBlocker />
      <ToastContainer />
      <Oracle isOpen={isOracleOpen} onClose={() => setIsOracleOpen(false)} navigate={(view) => { setActiveView(view); setIsOracleOpen(false); }} />
      <InstallPrompt /> 
      <MediaPlayer />
      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <OnboardingTour />
      <ChangelogModal isOpen={showChangelog} onClose={() => setShowChangelog(false)} />
      
      <div className={`fixed inset-y-0 left-0 z-50 transform ${mobileMenu ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out`}>
        <Sidebar activeView={activeView} setActiveView={(v) => { setActiveView(v); setMobileMenu(false); }} />
      </div>
      
      <main className="flex-1 flex flex-col min-w-0 bg-transparent h-screen relative z-10">
        <header className="h-16 border-b border-[#313244]/50 bg-[#252535]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden text-[#cdd6f4]"><Menu /></button>
            <div className="flex items-center text-[#a6adc8] text-sm"><span className="opacity-50 hidden sm:inline">System</span><ArrowRight size={14} className="mx-2 hidden sm:inline" /><span className="text-white font-bold capitalize tracking-wide">{activeView} Module</span></div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowChangelog(true)} className="text-[#a6adc8] hover:text-white" title="Changelog"><Info size={20} /></button>
            <NotificationCenter />
            <button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#1e1e2e]/50 border border-[#313244] rounded-lg text-xs text-[#a6adc8] hover:text-white hover:border-[#89b4fa] transition-colors" onClick={() => setIsOracleOpen(true)}><Command size={12} /><span>CMD+K</span></button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1e2e]/50 border border-[#313244]"><div className="w-2 h-2 rounded-full bg-[#a6e3a1] animate-pulse" /><span className="text-xs font-mono font-bold text-[#a6e3a1]">ONLINE</span></div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar pb-24">
          <div className="max-w-7xl mx-auto h-full">
            <ErrorBoundary>
              <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-[#89b4fa] border-t-transparent rounded-full animate-spin"></div></div>}>
                {activeView === 'dashboard' && <DashboardModule />}
                {activeView === 'aichat' && <ChatModule />}
                {activeView === 'analytics' && <AnalyticsModule />}
                {activeView === 'gradebook' && <GradebookModule />}
                {activeView === 'calendar' && <CalendarModule />}
                {activeView === 'scheduler' && <SchedulerModule />}
                {activeView === 'news' && <NewsModule />}
                {activeView === 'goals' && <GoalsModule />}
                {activeView === 'projects' && <ProjectsModule />}
                {activeView === 'tasks' && <TasksModule />}
                {activeView === 'quests' && <QuestsModule />}
                {activeView === 'skills' && <SkillsModule />}
                {activeView === 'habits' && <HabitsModule />}
                {activeView === 'focus' && <FocusModule />}
                {activeView === 'breathwork' && <BreathworkModule />}
                {activeView === 'journal' && <JournalModule />}
                {activeView === 'codelab' && <CodeLabModule />}
                {activeView === 'reader' && <ReaderModule />}
                {activeView === 'notes' && <NotesModule />}
                {activeView === 'bibliography' && <BibliographyModule />}
                {activeView === 'resources' && <ResourcesModule />}
                {activeView === 'canvas' && <CanvasModule />}
                {activeView === 'themestudio' && <ThemeForgeModule />}
                {activeView === 'tools' && <ToolsModule />}
                {activeView === 'flashcards' && <FlashcardsModule />}
                {activeView === 'quiz' && <QuizModule />}
                {activeView === 'social' && <SocialModule />}
                {activeView === 'leaderboard' && <LeaderboardModule />}
                {activeView === 'shop' && <ShopModule />}
                {activeView === 'achievements' && <AchievementsModule />}
                {activeView === 'resume' && <ResumeModule />}
                {activeView === 'settings' && <SettingsModule />}
                {activeView === 'profile' && <ProfileModule />}
                {activeView === 'exam' && <ExamModeModule />}
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </main>
      
      {mobileMenu && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenu(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <StudyHubShell />
    </AppProvider>
  );
}