import React, { useState } from 'react';
import { FileText, Link as LinkIcon, Video, Plus, Trash2, ExternalLink, Search, Tag, Library, BookOpen } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

export default function ResourcesModule() {
  const { resources, addResource, deleteResource } = useApp();
  const [filter, setFilter] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'PDF' | 'Link' | 'Video'>('Link');
  const [newUrl, setNewUrl] = useState('');
  const [newTags, setNewTags] = useState('');

  const handleAdd = async () => {
    if (!newTitle || !newUrl) return;
    const tagArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
    await addResource(newTitle, newType, newUrl, tagArray);
    setNewTitle(''); setNewUrl(''); setNewTags('');
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(filter.toLowerCase()) || 
    r.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
  );

  const getIcon = (type: string) => {
    if (type === 'PDF') return <FileText className="text-[#f38ba8]" size={20} />;
    if (type === 'Video') return <Video className="text-[#f9e2af]" size={20} />;
    return <LinkIcon className="text-[#89b4fa]" size={20} />;
  };

  return (
    <div className="h-full flex gap-8 animate-fade-in pb-6">
      
      {/* MAIN LIST */}
      <TiltCard className="flex-1 flex flex-col space-y-6 bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#89b4fa] via-[#cba6f7] to-[#89b4fa] opacity-30" />
        
        <div className="flex justify-between items-center z-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <Library className="text-[#89b4fa]" /> Data Library
            </h1>
            <p className="text-[#a6adc8] mt-1">Indexed study materials and references.</p>
          </div>
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-3 text-[#585b70]" />
            <input 
              placeholder="Search index..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-[#1e1e2e] border border-[#313244] rounded-xl pl-10 pr-4 py-2 text-white outline-none focus:border-[#89b4fa] transition-all placeholder-[#585b70]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 z-10">
          {filteredResources.map(res => (
            <div key={res.id} className="bg-[#1e1e2e]/80 p-4 rounded-2xl border border-[#313244] hover:border-[#89b4fa]/50 transition-all group flex items-center justify-between hover:bg-[#252535]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#252535] rounded-xl border border-[#313244] group-hover:scale-110 transition-transform">
                  {getIcon(res.type)}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-[#89b4fa] transition-colors">{res.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-[#313244] text-[#a6adc8] px-2 py-0.5 rounded uppercase font-bold tracking-wider">{res.type}</span>
                    {res.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-[#585b70] border border-[#313244] px-2 py-0.5 rounded flex items-center gap-1 bg-[#1e1e2e]">
                        <Tag size={8} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <a 
                  href={res.url} target="_blank" rel="noreferrer"
                  className="p-2 text-[#89b4fa] hover:bg-[#89b4fa]/10 rounded-lg transition-colors border border-transparent hover:border-[#89b4fa]/30"
                >
                  <ExternalLink size={20} />
                </a>
                <MagneticButton 
                  onClick={() => deleteResource(res.id)}
                  className="p-2 text-[#f38ba8] hover:bg-[#f38ba8]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={20} />
                </MagneticButton>
              </div>
            </div>
          ))}
          
          {filteredResources.length === 0 && (
            <div className="text-center py-32 text-[#585b70] animate-pulse">
                <div className="flex justify-center mb-4"><Library size={64} className="opacity-20" /></div>
                No resources found in the index.
            </div>
          )}
        </div>
      </TiltCard>

      {/* SIDEBAR UPLOAD */}
      <TiltCard className="w-80 bg-[#252535] border border-[#313244] rounded-3xl p-6 h-fit sticky top-0 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Plus size={20} className="text-[#a6e3a1]" /> Add Resource
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2">Title</label>
            <input 
              value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa] transition-all placeholder-[#585b70]"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2">Type</label>
            <div className="flex bg-[#1e1e2e] p-1 rounded-xl shadow-inner">
              {['Link', 'PDF', 'Video'].map(type => (
                <button 
                  key={type}
                  onClick={() => setNewType(type as any)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newType === type ? 'bg-[#313244] text-white shadow border border-[#45475a]' : 'text-[#585b70] hover:text-[#a6adc8]'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2">URL / Source</label>
            <input 
              value={newUrl} onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa] transition-all placeholder-[#585b70]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2">Tags</label>
            <input 
              value={newTags} onChange={(e) => setNewTags(e.target.value)}
              placeholder="math, physics, ref..."
              className="w-full bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa] transition-all placeholder-[#585b70]"
            />
          </div>

          <MagneticButton onClick={handleAdd} className="w-full mt-4 bg-[#89b4fa] text-[#1e1e2e] py-3 rounded-xl font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(137,180,250,0.3)]">
            Index Resource
          </MagneticButton>
        </div>
      </TiltCard>

    </div>
  );
}