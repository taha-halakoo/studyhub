import React, { useState } from 'react';
import { Folder, Plus, Trash2, Layout, BookOpen, CheckCircle, FileText, Layers, Archive } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

const ICONS = ['Folder', 'Layout', 'BookOpen', 'CheckCircle', 'FileText', 'Layers', 'Archive'];

const ProjectCard = ({ project, stats, onDelete }: any) => (
  <TiltCard className="bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl p-6 group hover:border-[#89b4fa]/50 relative overflow-hidden flex flex-col h-64">
    {/* Holographic Edge */}
    <div 
        className="absolute top-0 left-0 w-1.5 h-full transition-all duration-500 shadow-[0_0_15px_currentColor]" 
        style={{ backgroundColor: project.color, color: project.color }} 
    />
    
    <div className="flex justify-between items-start mb-4 pl-4 relative z-10">
        <div 
            className="p-3.5 rounded-2xl bg-[#1e1e2e] text-white shadow-lg group-hover:scale-110 transition-transform duration-300 border border-[#313244]"
            style={{ color: project.color }}
        >
            {project.icon === 'Layout' ? <Layout size={24} /> : 
             project.icon === 'BookOpen' ? <BookOpen size={24} /> :
             project.icon === 'CheckCircle' ? <CheckCircle size={24} /> :
             project.icon === 'FileText' ? <FileText size={24} /> :
             project.icon === 'Layers' ? <Layers size={24} /> :
             project.icon === 'Archive' ? <Archive size={24} /> : <Folder size={24} />}
        </div>
        <MagneticButton onClick={() => onDelete(project.id)} className="text-[#f38ba8] opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#f38ba8]/10 rounded-lg">
            <Trash2 size={18} />
        </MagneticButton>
    </div>

    <div className="pl-4 flex-1 flex flex-col justify-between relative z-10">
        <div>
            <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-[#89b4fa] transition-colors">{project.title}</h3>
            <p className="text-sm text-[#a6adc8] line-clamp-2 leading-relaxed">{project.description}</p>
        </div>

        <div>
            <div className="flex justify-between text-[10px] font-bold text-[#a6adc8] mb-2 uppercase tracking-widest">
                <span>Completion</span>
                <span style={{ color: project.color }}>{stats.progress}%</span>
            </div>
            {/* Liquid Progress Bar */}
            <div className="w-full h-2.5 bg-[#1e1e2e] rounded-full overflow-hidden border border-[#313244]">
                <div 
                    className="h-full transition-all duration-700 relative" 
                    style={{ width: `${stats.progress}%`, backgroundColor: project.color }} 
                >
                    <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                </div>
            </div>
            <div className="mt-3 text-xs text-[#585b70] text-right font-mono">
                {stats.completed}/{stats.total} Directives
            </div>
        </div>
    </div>
    
    {/* Background Glow */}
    <div 
        className="absolute -right-10 -bottom-10 w-40 h-40 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none"
        style={{ backgroundColor: project.color }}
    />
  </TiltCard>
);

export default function ProjectsModule() {
  const { projects, addProject, deleteProject, tasks } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState('#89b4fa');
  const [newIcon, setNewIcon] = useState('Folder');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setIsAdding(true);
    await addProject(newTitle, newDesc, newColor, newIcon);
    setNewTitle(''); setNewDesc(''); setIsAdding(false);
  };

  const getProjectStats = (pid: string) => {
    const projectTasks = tasks.filter(t => t.project_id === pid);
    const completed = projectTasks.filter(t => t.is_completed).length;
    const total = projectTasks.length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, progress };
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Command Deck <span className="text-xs bg-[#89b4fa]/10 text-[#89b4fa] px-2 py-1 rounded border border-[#89b4fa]/20 font-mono tracking-widest">PROJECTS</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Manage complex operations and blueprints.</p>
        </div>
      </div>

      {/* CREATE BAR */}
      <TiltCard className="bg-[#252535] p-6 rounded-3xl border border-[#313244] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#89b4fa] via-[#cba6f7] to-[#89b4fa] opacity-30" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
                <input 
                placeholder="Project Title..."
                value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#1e1e2e] px-4 py-3 rounded-xl border border-[#313244] text-white outline-none focus:border-[#89b4fa] transition-all placeholder-[#585b70]"
                />
            </div>
            <div className="md:col-span-4">
                <input 
                placeholder="Brief Description..."
                value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-[#1e1e2e] px-4 py-3 rounded-xl border border-[#313244] text-white outline-none focus:border-[#89b4fa] transition-all placeholder-[#585b70]"
                />
            </div>
            <div className="md:col-span-4 flex gap-3">
                <div className="relative group">
                    <input 
                        type="color" 
                        value={newColor} onChange={(e) => setNewColor(e.target.value)}
                        className="w-12 h-full rounded-xl bg-[#1e1e2e] border border-[#313244] cursor-pointer p-1 opacity-0 absolute inset-0 z-10"
                    />
                    <div className="w-12 h-full rounded-xl border border-[#313244] flex items-center justify-center" style={{ backgroundColor: newColor }}>
                        <div className="w-4 h-4 bg-white/50 rounded-full" />
                    </div>
                </div>
                
                <div className="flex-1 bg-[#1e1e2e] rounded-xl border border-[#313244] flex items-center justify-around px-2">
                    {ICONS.slice(0,4).map(icon => (
                        <button 
                            key={icon} 
                            onClick={() => setNewIcon(icon)}
                            className={`p-2 rounded-lg transition-all ${newIcon === icon ? 'bg-[#313244] text-[#89b4fa] shadow-sm' : 'text-[#585b70] hover:text-white'}`}
                        >
                            {icon === 'Folder' ? <Folder size={16} /> : 
                            icon === 'Layout' ? <Layout size={16} /> :
                            icon === 'BookOpen' ? <BookOpen size={16} /> : <CheckCircle size={16} />}
                        </button>
                    ))}
                </div>
                
                <MagneticButton onClick={handleAdd} className="bg-[#89b4fa] text-[#1e1e2e] font-bold px-6 rounded-xl hover:bg-white transition-all shadow-[0_0_15px_rgba(137,180,250,0.3)]">
                    <Plus size={20} />
                </MagneticButton>
            </div>
        </div>
      </TiltCard>

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
            <ProjectCard 
                key={project.id} 
                project={project} 
                stats={getProjectStats(project.id)} 
                onDelete={deleteProject} 
            />
        ))}
        
        {projects.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-[#313244] rounded-3xl flex flex-col items-center justify-center group hover:border-[#89b4fa]/30 transition-colors">
            <div className="p-6 bg-[#1e1e2e] rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Folder size={48} className="text-[#313244] group-hover:text-[#89b4fa] transition-colors" />
            </div>
            <h3 className="text-[#a6adc8] font-bold text-lg">No Active Blueprints</h3>
            <p className="text-[#585b70]">Initialize a new workspace to organize operations.</p>
          </div>
        )}
      </div>
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}