import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, Filter, Globe, Zap, Radio } from 'lucide-react';
import { TiltCard } from '../../ui/TiltCard';
import { MagneticButton } from '../../ui/MagneticButton';

const MOCK_NEWS = [
  { id: 1, title: 'Advancements in Quantum Computing Architecture', source: 'TechDaily', category: 'Tech', time: '2h ago' },
  { id: 2, title: 'The Neurobiology of Deep Focus', source: 'ScienceNet', category: 'Science', time: '4h ago' },
  { id: 3, title: 'Optimizing React Performance with Concurrent Mode', source: 'DevDigest', category: 'Coding', time: '5h ago' },
  { id: 4, title: 'Global Energy Trends for 2025', source: 'WorldEng', category: 'Engineering', time: '1d ago' },
  { id: 5, title: 'SpaceX Starship Successful Orbit', source: 'SpaceNews', category: 'Tech', time: '1d ago' },
  { id: 6, title: 'New Alloy Discovered for High-Temp Applications', source: 'MaterialScience', category: 'Engineering', time: '2d ago' },
];

export default function NewsModule() {
  const [filter, setFilter] = useState('All');
  const [articles, setArticles] = useState(MOCK_NEWS);
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setArticles([...MOCK_NEWS].sort(() => Math.random() - 0.5));
      setLoading(false);
    }, 1000);
  };

  const filtered = filter === 'All' ? articles : articles.filter(a => a.category === filter);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Global Uplink <span className="text-xs bg-[#89b4fa]/10 text-[#89b4fa] px-2 py-1 rounded border border-[#89b4fa]/20 font-mono tracking-widest">NEWS FEED</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Curated intelligence stream.</p>
        </div>
        <MagneticButton onClick={refresh} className={`p-3 bg-[#252535] rounded-xl text-white hover:bg-[#89b4fa] hover:text-[#1e1e2e] transition-colors border border-[#313244] shadow-lg ${loading ? 'animate-spin' : ''}`}>
          <RefreshCw size={20} />
        </MagneticButton>
      </div>

      {/* FILTER BAR */}
      <TiltCard className="bg-[#252535]/80 backdrop-blur-md p-2 rounded-2xl border border-[#313244] shadow-xl flex gap-2 overflow-x-auto scrollbar-hide">
        {['All', 'Tech', 'Science', 'Coding', 'Engineering'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border whitespace-nowrap
              ${filter === cat 
                ? 'bg-[#89b4fa] text-[#1e1e2e] border-[#89b4fa] shadow-[0_0_15px_rgba(137,180,250,0.4)]' 
                : 'bg-[#1e1e2e] text-[#a6adc8] border-transparent hover:text-white hover:bg-[#313244]'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </TiltCard>

      {/* NEWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((article, i) => (
          <TiltCard 
            key={article.id} 
            className="bg-[#252535]/80 backdrop-blur-md p-6 rounded-3xl border border-[#313244] hover:border-[#89b4fa]/50 transition-all group cursor-pointer flex flex-col justify-between h-56 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 bg-[#89b4fa] blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" />
            
            <div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#89b4fa] bg-[#89b4fa]/10 px-2 py-1 rounded border border-[#89b4fa]/20 flex items-center gap-1">
                    <Radio size={10} className="animate-pulse" /> {article.category}
                </span>
                <span className="text-xs text-[#585b70] font-mono">{article.time}</span>
              </div>
              <h3 className="text-xl font-black text-white leading-snug group-hover:text-[#89b4fa] transition-colors relative z-10 line-clamp-3">
                {article.title}
              </h3>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-[#313244] relative z-10 mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e1e2e] flex items-center justify-center text-xs font-bold text-[#a6adc8] border border-[#313244] shadow-inner">
                  {article.source[0]}
                </div>
                <span className="text-sm font-medium text-[#a6adc8]">{article.source}</span>
              </div>
              <MagneticButton className="p-2 text-[#585b70] group-hover:text-white transition-colors bg-[#1e1e2e] rounded-lg border border-[#313244] hover:border-[#89b4fa] hover:bg-[#89b4fa] hover:text-[#1e1e2e]">
                <ExternalLink size={16} />
              </MagneticButton>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}