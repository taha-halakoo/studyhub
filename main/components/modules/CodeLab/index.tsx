import React, { useState } from 'react';
import { Code, Save, Trash2, Terminal, Plus, Hash, Play, Copy } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { CodeSnippet } from '../../../types';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

export default function CodeLabModule() {
  const { codeSnippets, saveSnippet, deleteSnippet, showToast } = useApp();
  const [activeSnippet, setActiveSnippet] = useState<CodeSnippet | null>(null);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');

  const handleSelect = (snippet: CodeSnippet) => {
    setActiveSnippet(snippet);
    setTitle(snippet.title);
    setCode(snippet.code);
    setLanguage(snippet.language);
    setTags(snippet.tags.join(', '));
  };

  const handleNew = () => {
    setActiveSnippet(null);
    setTitle('');
    setCode('// Start coding...');
    setLanguage('javascript');
    setTags('');
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    await saveSnippet(title, language, code, tagArray, activeSnippet?.id);
  };

  const copyCode = () => {
      navigator.clipboard.writeText(code);
      showToast("Code copied to clipboard", "success");
  };

  return (
    <div className="h-full flex gap-8 animate-fade-in pb-6">
      
      {/* Sidebar List */}
      <TiltCard className="w-72 flex flex-col bg-[#252535]/80 backdrop-blur-xl border border-[#313244] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#89b4fa] via-[#a6e3a1] to-[#89b4fa] opacity-50" />
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Terminal className="text-[#a6e3a1]" size={20} /> Code Lab
          </h2>
          <MagneticButton onClick={handleNew} className="p-2 bg-[#89b4fa] text-[#1e1e2e] rounded-xl hover:bg-white transition-all shadow-lg">
            <Plus size={18} />
          </MagneticButton>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar relative z-10 pr-2">
          {codeSnippets.map(snippet => (
            <div 
              key={snippet.id} 
              onClick={() => handleSelect(snippet)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all group hover:scale-[1.02]
                ${activeSnippet?.id === snippet.id 
                    ? 'bg-[#1e1e2e] border-[#a6e3a1] shadow-[0_0_15px_rgba(166,227,161,0.2)]' 
                    : 'bg-[#1e1e2e]/50 border-[#313244] hover:border-[#89b4fa]'
                }
              `}
            >
              <div className="font-bold text-sm text-white truncate mb-2">{snippet.title}</div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono text-[#a6e3a1] bg-[#a6e3a1]/10 px-2 py-0.5 rounded border border-[#a6e3a1]/20">{snippet.language}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteSnippet(snippet.id); }}
                  className="text-[#f38ba8] opacity-0 group-hover:opacity-100 hover:scale-125 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {codeSnippets.length === 0 && <div className="text-center text-[#585b70] text-xs py-10">No snippets saved.</div>}
        </div>
      </TiltCard>

      {/* Editor Area */}
      <TiltCard className="flex-1 bg-[#1e1e2e] border border-[#313244] rounded-3xl flex flex-col overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-[#252535]/20 pointer-events-none" />
        
        {/* Editor Header */}
        <div className="p-4 bg-[#1e1e2e] border-b border-[#313244] flex items-center gap-4 relative z-10">
          <div className="p-2 bg-[#252535] rounded-lg text-[#89b4fa]"><Code size={20} /></div>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Snippet Title..." 
            className="flex-1 bg-transparent text-lg font-bold text-white outline-none placeholder-[#585b70]"
          />
          <div className="flex items-center gap-2">
            <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#252535] text-[#a6adc8] text-xs font-bold rounded-lg px-3 py-2 outline-none border border-[#313244] hover:border-[#89b4fa] transition-colors uppercase tracking-wider"
            >
                {['javascript', 'typescript', 'python', 'html', 'css', 'sql'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <MagneticButton onClick={copyCode} className="p-2 bg-[#252535] text-[#a6adc8] rounded-lg hover:text-white border border-[#313244] hover:border-[#89b4fa] transition-all">
                <Copy size={16} />
            </MagneticButton>
            <MagneticButton onClick={handleSave} disabled={!title} className="bg-[#a6e3a1] text-[#1e1e2e] px-4 py-2 rounded-lg text-xs font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(166,227,161,0.4)] flex items-center gap-2 disabled:opacity-50">
                <Save size={16} /> Save
            </MagneticButton>
          </div>
        </div>

        {/* Code Area */}
        <div className="flex-1 relative z-10">
            <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-[#1e1e2e]/80 p-6 font-mono text-sm text-[#cdd6f4] outline-none resize-none leading-relaxed custom-scrollbar selection:bg-[#89b4fa]/30"
            spellCheck="false"
            />
        </div>

        {/* Footer Tags */}
        <div className="p-3 bg-[#1e1e2e] border-t border-[#313244] flex items-center gap-3 relative z-10">
          <Hash size={14} className="text-[#585b70]" />
          <input 
            value={tags} 
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)..."
            className="flex-1 bg-transparent text-xs text-[#a6adc8] outline-none placeholder-[#585b70] font-mono"
          />
          <div className="flex items-center gap-2 text-[10px] text-[#585b70] font-mono uppercase tracking-wider">
             <div className="w-2 h-2 rounded-full bg-[#a6e3a1] animate-pulse" /> Live Editor
          </div>
        </div>
      </TiltCard>

    </div>
  );
}