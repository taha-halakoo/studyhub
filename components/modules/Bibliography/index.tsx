import React, { useState } from 'react';
import { Book, Globe, FileText, Plus, Trash2, Copy, Search, Quote } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Citation } from '../../../types';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

export default function BibliographyModule() {
  const { citations, addCitation, deleteCitation, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'Book' | 'Website' | 'Journal'>('Book');
  const [formData, setFormData] = useState({ title: '', author: '', year: '', publisher: '', url: '' });
  const [filter, setFilter] = useState('');

  const handleAdd = async () => {
    if (!formData.title || !formData.author) return;
    await addCitation({ type: activeTab, ...formData });
    setFormData({ title: '', author: '', year: '', publisher: '', url: '' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Citation Copied", "success");
  };

  const filteredCitations = citations.filter(c => 
    c.title.toLowerCase().includes(filter.toLowerCase()) || 
    c.author.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="h-full flex gap-8 animate-fade-in pb-6">
      
      {/* FORM SIDEBAR */}
      <TiltCard className="w-80 flex flex-col bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl p-6 shadow-2xl h-fit sticky top-0">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white tracking-tight mb-2 flex items-center gap-2">
            <Quote className="text-[#a6adc8]" size={20} /> Reference Engine
          </h1>
          <p className="text-[#a6adc8] text-xs">Generate APA/MLA citations instantly.</p>
        </div>

        <div className="flex bg-[#1e1e2e] p-1 rounded-xl mb-6 shadow-inner">
            {['Book', 'Website', 'Journal'].map(type => (
              <button 
                key={type}
                onClick={() => setActiveTab(type as any)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${activeTab === type ? 'bg-[#313244] text-white shadow border border-[#45475a]' : 'text-[#585b70] hover:text-[#a6adc8]'}`}
              >
                {type}
              </button>
            ))}
        </div>

        <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#a6adc8] uppercase mb-1.5 ml-1">Title</label>
              <input 
                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa] transition-all text-sm placeholder-[#585b70]"
                placeholder="Source Title"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#a6adc8] uppercase mb-1.5 ml-1">Author</label>
              <input 
                value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa] transition-all text-sm placeholder-[#585b70]"
                placeholder="Last, First M."
              />
            </div>
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-[#a6adc8] uppercase mb-1.5 ml-1">Year</label>
                    <input 
                        value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}
                        className="w-full bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa] transition-all text-sm placeholder-[#585b70]"
                        placeholder="2024"
                    />
                </div>
                {activeTab !== 'Website' && (
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-[#a6adc8] uppercase mb-1.5 ml-1">Publisher</label>
                        <input 
                            value={formData.publisher} onChange={e => setFormData({ ...formData, publisher: e.target.value })}
                            className="w-full bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa] transition-all text-sm placeholder-[#585b70]"
                            placeholder="Press"
                        />
                    </div>
                )}
            </div>
            {activeTab === 'Website' && (
                <div>
                    <label className="block text-[10px] font-bold text-[#a6adc8] uppercase mb-1.5 ml-1">URL</label>
                    <input 
                        value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })}
                        className="w-full bg-[#1e1e2e] p-3 rounded-xl text-white border border-[#313244] outline-none focus:border-[#89b4fa] transition-all text-sm placeholder-[#585b70]"
                        placeholder="https://..."
                    />
                </div>
            )}

            <MagneticButton onClick={handleAdd} disabled={!formData.title} className="w-full mt-4 bg-[#89b4fa] text-[#1e1e2e] font-bold py-3 rounded-xl hover:bg-white shadow-[0_0_15px_rgba(137,180,250,0.3)] transition-all flex items-center justify-center">
                <Plus size={18} className="mr-2" /> Add Citation
            </MagneticButton>
        </div>
      </TiltCard>

      {/* LIST VIEW */}
      <TiltCard className="flex-1 flex flex-col bg-[#1e1e2e] border border-[#313244] rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#89b4fa] via-[#cba6f7] to-[#89b4fa] opacity-30" />
        
        <div className="p-5 border-b border-[#313244] bg-[#252535] flex justify-between items-center z-10">
            <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-3 text-[#585b70]" />
                <input 
                    placeholder="Search references..."
                    value={filter} onChange={e => setFilter(e.target.value)}
                    className="w-full bg-[#1e1e2e] border border-[#313244] rounded-xl pl-9 pr-4 py-2 text-white outline-none focus:border-[#89b4fa] text-sm transition-all"
                />
            </div>
            <div className="text-xs font-mono text-[#a6adc8] bg-[#1e1e2e] px-3 py-1.5 rounded-lg border border-[#313244]">{citations.length} References</div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar relative z-10">
            {filteredCitations.map(cit => (
                <div key={cit.id} className="bg-[#252535] p-5 rounded-2xl border border-[#313244] hover:border-[#89b4fa] transition-all group hover:bg-[#2a2a3a] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 bg-[#89b4fa] blur-[60px] opacity-0 group-hover:opacity-5 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#1e1e2e] rounded-xl text-[#89b4fa] border border-[#313244]">
                                {cit.type === 'Book' ? <Book size={20} /> : cit.type === 'Website' ? <Globe size={20} /> : <FileText size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base leading-tight">{cit.title}</h3>
                                <p className="text-xs text-[#a6adc8] mt-1 font-mono">{cit.author} • {cit.year}</p>
                            </div>
                        </div>
                        <MagneticButton onClick={() => deleteCitation(cit.id)} className="text-[#f38ba8] opacity-0 group-hover:opacity-100 hover:bg-[#f38ba8]/10 p-2 rounded-lg transition-all">
                            <Trash2 size={18} />
                        </MagneticButton>
                    </div>

                    <div className="bg-[#1e1e2e]/80 p-4 rounded-xl border border-[#313244] flex items-center justify-between group/cite relative z-10 hover:border-[#89b4fa]/30 transition-colors">
                        <code className="text-xs text-[#cdd6f4] font-mono line-clamp-1 select-all">{cit.format_cache?.apa}</code>
                        <MagneticButton 
                            onClick={() => copyToClipboard(cit.format_cache?.apa || '')}
                            className="text-[#a6adc8] hover:text-white flex items-center gap-2 text-[10px] uppercase font-bold bg-[#313244] px-3 py-1.5 rounded-lg border border-[#45475a] transition-all hover:bg-[#89b4fa] hover:border-[#89b4fa]"
                        >
                            <Copy size={12} /> Copy APA
                        </MagneticButton>
                    </div>
                </div>
            ))}
            {citations.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-[#585b70] animate-pulse">
                    <Book size={64} className="mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest">No citations generated yet</p>
                </div>
            )}
        </div>
      </TiltCard>

    </div>
  );
}