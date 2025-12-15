import React, { useState } from 'react';
import { BookOpen, ExternalLink, ChevronRight, ChevronLeft, Maximize2, Globe, FileText, Video } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import NotesModule from '../Notes';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

export default function ReaderModule() {
  const { resources } = useApp();
  const [activeResource, setActiveResource] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const resource = resources.find(r => r.id === activeResource);

  const getIcon = (type: string) => {
    if (type === 'PDF') return <FileText size={16} className="text-[#f38ba8]" />;
    if (type === 'Video') return <Video size={16} className="text-[#f9e2af]" />;
    return <Globe size={16} className="text-[#89b4fa]" />;
  };

  return (
    <div className="h-full flex gap-6 animate-fade-in relative pb-6">
      
      {/* RESOURCE SIDEBAR (Glass Panel) */}
      <TiltCard className={`
        flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        bg-[#252535]/80 backdrop-blur-xl border border-[#313244] rounded-3xl overflow-hidden shadow-2xl relative
        ${sidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'}
      `}>
        <div className="p-6 border-b border-[#313244] bg-[#1e1e2e]/50">
            <h2 className="font-black text-white flex items-center gap-2 text-lg">
                <BookOpen size={20} className="text-[#89b4fa]" /> Library
            </h2>
            <p className="text-xs text-[#a6adc8] mt-1">Select a source to analyze.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {resources.map(res => (
                <button 
                    key={res.id}
                    onClick={() => setActiveResource(res.id)}
                    className={`w-full text-left p-4 rounded-2xl text-sm transition-all group flex items-center gap-3 border
                        ${activeResource === res.id 
                            ? 'bg-[#1e1e2e] text-white border-[#89b4fa] shadow-lg' 
                            : 'bg-transparent text-[#a6adc8] border-transparent hover:bg-[#1e1e2e]/50 hover:text-white'
                        }
                    `}
                >
                    <div className="p-2 rounded-lg bg-[#313244] group-hover:scale-110 transition-transform">
                        {getIcon(res.type)}
                    </div>
                    <span className="truncate font-medium">{res.title}</span>
                </button>
            ))}
            {resources.length === 0 && <div className="text-center text-[#585b70] py-10 text-xs uppercase tracking-widest">Index Empty</div>}
        </div>
      </TiltCard>

      {/* TOGGLE BUTTON */}
      <MagneticButton 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-6 z-30 bg-[#1e1e2e] border border-[#313244] text-[#a6adc8] p-2 rounded-xl hover:text-white hover:border-[#89b4fa] shadow-lg transition-all"
        style={{ left: sidebarOpen ? '21rem' : '0' }}
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </MagneticButton>

      {/* CONTENT AREA (SPLIT) */}
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden gap-6">
        
        {/* LEFT: VIEWER */}
        <TiltCard className="flex-1 bg-[#1e1e2e] border border-[#313244] rounded-3xl relative flex flex-col overflow-hidden shadow-2xl group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#89b4fa] via-[#cba6f7] to-[#89b4fa] opacity-30" />
            
            {resource ? (
                resource.type === 'PDF' || resource.type === 'Link' ? (
                    <iframe src={resource.url} className="w-full h-full bg-white" title="Reader" />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                        <div className="p-8 bg-[#252535] rounded-full mb-6 shadow-[0_0_50px_rgba(137,180,250,0.1)] animate-in zoom-in duration-500">
                            <BookOpen size={64} className="text-[#89b4fa]" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2 max-w-md">{resource.title}</h2>
                        <p className="text-[#a6adc8] mb-8">External Source Protocol</p>
                        <a 
                            href={resource.url} target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 bg-[#89b4fa] text-[#1e1e2e] px-8 py-4 rounded-2xl font-bold hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(137,180,250,0.4)]"
                        >
                            Open Resource <ExternalLink size={18} />
                        </a>
                    </div>
                )
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[#585b70] animate-pulse">
                    <BookOpen size={64} className="mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest">Select a data source</p>
                </div>
            )}
        </TiltCard>

        {/* RIGHT: NOTES (Integrated) */}
        <div className="flex-1 h-full overflow-hidden rounded-3xl border border-[#313244] shadow-2xl">
             <NotesModule />
        </div>

      </div>
    </div>
  );
}