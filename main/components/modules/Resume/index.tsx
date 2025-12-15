import React, { useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { Download, User, Award, Code, Briefcase, FileText, Printer } from 'lucide-react';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';
import { Achievement } from '../../../types';

export default function ResumeModule() {
  const { profile, notes, tasks, achievements } = useApp();
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = resumeRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); 
    }
  };

  const unlockedAchievements = achievements.filter((a: Achievement) => profile?.achievements?.includes(a.id));

  return (
    <div className="h-full flex flex-col gap-8 animate-fade-in pb-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Legacy Protocol <span className="text-xs bg-[#cba6f7]/10 text-[#cba6f7] px-2 py-1 rounded border border-[#cba6f7]/20 font-mono tracking-widest">RESUME</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Automated Curriculum Vitae Generator.</p>
        </div>
        <MagneticButton onClick={handlePrint} className="bg-[#89b4fa] text-[#1e1e2e] px-6 py-3 rounded-xl font-bold hover:bg-white shadow-[0_0_20px_rgba(137,180,250,0.3)] transition-all flex items-center gap-2">
          <Printer size={20} /> Export to PDF
        </MagneticButton>
      </div>

      <div className="flex-1 overflow-hidden bg-[#181825] rounded-3xl border border-[#313244] shadow-2xl relative p-8 flex justify-center items-start overflow-y-auto custom-scrollbar">
        {/* Paper Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-5 pointer-events-none" />
        
        {/* A4 PAPER SIMULATION */}
        <div ref={resumeRef} className="bg-white text-[#1e1e2e] w-[210mm] min-h-[297mm] p-[20mm] shadow-2xl space-y-10 relative z-10 transform scale-95 origin-top">
          
          {/* HEADER */}
          <div className="border-b-4 border-[#1e1e2e] pb-8 flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter">{profile?.username || 'ENGINEER'}</h1>
              <p className="text-2xl font-mono text-[#585b70] mt-2 tracking-wide uppercase">{profile?.title || 'System Architect'}</p>
            </div>
            <div className="text-right">
                <div className="bg-[#1e1e2e] text-white px-4 py-1 font-bold text-sm mb-1 inline-block">LEVEL {profile?.level}</div>
                <div className="text-sm font-mono font-bold text-[#585b70]">{profile?.xp.toLocaleString()} XP</div>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3 text-[#1e1e2e] font-bold uppercase tracking-wider text-xs"><Code size={16}/> Knowledge Base</div>
              <div className="text-4xl font-black">{notes.length}</div>
              <div className="text-xs text-gray-500 mt-1">Data Nodes Created</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3 text-[#1e1e2e] font-bold uppercase tracking-wider text-xs"><Briefcase size={16}/> Operations</div>
              <div className="text-4xl font-black">{tasks.filter(t => t.is_completed).length}</div>
              <div className="text-xs text-gray-500 mt-1">Directives Executed</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3 text-[#1e1e2e] font-bold uppercase tracking-wider text-xs"><Award size={16}/> Distinctions</div>
              <div className="text-4xl font-black">{unlockedAchievements.length}</div>
              <div className="text-xs text-gray-500 mt-1">Medals Awarded</div>
            </div>
          </div>

          {/* ACHIEVEMENTS LIST */}
          <div>
            <h2 className="text-xl font-black uppercase border-b-2 border-gray-200 pb-2 mb-6 flex items-center gap-2">
                <Award size={24} /> Honors & Awards
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {unlockedAchievements.map((ach: Achievement) => (
                <div key={ach.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl text-[#1e1e2e] font-bold border-2 border-[#1e1e2e] rounded-lg w-12 h-12 flex items-center justify-center shrink-0">{ach.icon}</div>
                  <div>
                    <div className="font-bold text-lg leading-tight">{ach.title}</div>
                    <div className="text-xs text-gray-600 mt-1 leading-relaxed">{ach.description}</div>
                  </div>
                </div>
              ))}
              {unlockedAchievements.length === 0 && <p className="text-gray-400 italic col-span-2 text-center py-4">No records found. Complete objectives to populate.</p>}
            </div>
          </div>

          {/* SKILLS / TAGS */}
          <div>
            <h2 className="text-xl font-black uppercase border-b-2 border-gray-200 pb-2 mb-6 flex items-center gap-2">
                <FileText size={24} /> Technical Competencies
            </h2>
            <div className="flex flex-wrap gap-3">
              {Array.from(new Set([...notes.flatMap(n=>n.tags||[]), ...tasks.flatMap(t=>t.tags||[])])).map(tag => (
                <span key={tag} className="bg-[#1e1e2e] text-white px-4 py-2 rounded font-mono text-sm font-bold shadow-sm">
                  #{tag}
                </span>
              ))}
              {notes.flatMap(n=>n.tags||[]).length === 0 && <p className="text-gray-400 italic text-sm">No competence tags detected.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}