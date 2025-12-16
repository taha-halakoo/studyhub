import React, { useState, useEffect, useRef } from 'react';
import { Save, Trash2, Plus, FileText, Maximize2, Minimize2, Tag, Pin, Link, Volume2, VolumeX, AlignLeft, Mic, MicOff, LayoutTemplate, Search, Clock, BookOpen, Inbox } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Note } from '../../../types';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';
import { EmptyState } from '../../ui/EmptyState';

const MarkdownPreview = ({ content, allNotes, onLinkClick }: { content: string, allNotes: Note[], onLinkClick: (title: string) => void }) => {
  if (!content) return <div className="text-[#585b70] italic flex flex-col items-center justify-center h-full opacity-50"><span>Preview will appear here...</span></div>;
  const processContent = (text: string) => {
    let html = text
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black text-white mb-4 mt-6 border-b border-[#313244] pb-2">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-[#89b4fa] mb-3 mt-5">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-[#a6e3a1] mb-2 mt-4">$1</h3>');
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong class="text-[#a6e3a1] font-bold">$1</strong>')
               .replace(/`(.*?)`/gim, '<code class="bg-[#313244] text-[#f9e2af] px-1.5 py-0.5 rounded font-mono text-sm border border-[#45475a]">$1</code>');
    html = html.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
      const linkTitle = p1.trim();
      const exists = allNotes.some(n => n.title.toLowerCase() === linkTitle.toLowerCase());
      return `<span data-link="${linkTitle}" class="cursor-pointer font-bold ${exists ? 'text-[#89b4fa] hover:underline decoration-wavy' : 'text-[#f38ba8] opacity-70'} transition-colors bg-[#89b4fa]/10 px-1 rounded">[[${linkTitle}]]</span>`;
    });
    html = html.replace(/\n/gim, '<br />');
    return html;
  };
  const handleClick = (e: React.MouseEvent) => { const target = e.target as HTMLElement; if (target.dataset.link) onLinkClick(target.dataset.link); };
  return <div className="prose prose-invert max-w-none leading-relaxed" onClick={handleClick} dangerouslySetInnerHTML={{ __html: processContent(content) }} />;
};

export default function NotesModule() {
  const { notes, saveNote, deleteNote, togglePinNote, showToast } = useApp();
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [zenMode, setZenMode] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('Saved');
  const [filterTag, setFilterTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const typeSound = useRef(new Audio('https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8c8a73467.mp3?filename=keyboard-typing-5997.mp3'));
  useEffect(() => { if(typeSound.current) typeSound.current.volume = 0.2; }, []);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false; recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (activeNote) setActiveNote({ ...activeNote, content: activeNote.content + ' ' + transcript });
      };
      recognition.start();
    } else alert("Browser does not support Voice API.");
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeNote) return;
    setActiveNote({ ...activeNote, content: e.target.value });
    setAutoSaveStatus('Typing...');
    if (soundEnabled) { const clone = typeSound.current.cloneNode() as HTMLAudioElement; clone.volume = 0.1; clone.play().catch(() => {}); }
  };

  useEffect(() => {
    if (!activeNote) return;
    const timer = setTimeout(() => { saveNote(activeNote.title, activeNote.content, activeNote.id, activeNote.tags); setAutoSaveStatus('Saved'); }, 2000); 
    return () => clearTimeout(timer);
  }, [activeNote?.content, activeNote?.title, activeNote?.tags]);

  const handleCreate = () => {
    const newNote = { id: '', title: '', content: '', updated_at: new Date().toISOString(), tags: [], is_pinned: false };
    setActiveNote(newNote as Note); setAutoSaveStatus('New Entry');
  };

  const handleTemplate = (type: string) => {
      let content = '';
      if (type === 'cornell') content = '# Topic:\n## Cues\n- Key point 1\n- Key point 2\n\n## Notes\n- Detailed notes here...\n\n## Summary\n- Summary of the lecture...';
      if (type === 'meeting') content = '# Meeting: [Title]\n**Date:** [Date]\n**Attendees:** [Names]\n\n## Agenda\n1. Item 1\n2. Item 2\n\n## Action Items\n- [ ] Task 1\n- [ ] Task 2';
      if (type === 'code') content = '# Function: [Name]\n\n## Description\nWhat does this code do?\n\n## Parameters\n- `param1`: Description\n\n## Example\n```javascript\nconst x = 1;\n```';
      
      const newNote = { id: '', title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`, content, updated_at: new Date().toISOString(), tags: [type], is_pinned: false };
      setActiveNote(newNote as Note);
      setShowTemplates(false);
  };

  const handleLinkClick = (linkTitle: string) => {
    const targetNote = notes.find(n => n.title.toLowerCase() === linkTitle.toLowerCase());
    if (targetNote) { setActiveNote(targetNote); showToast(`Jumped to [[${targetNote.title}]]`, "success"); } 
    else if (confirm(`Note "${linkTitle}" does not exist. Create it?`)) {
        const newNote = { id: '', title: linkTitle, content: `# ${linkTitle}\nCreated via link from [[${activeNote?.title}]]`, updated_at: new Date().toISOString(), tags: [], is_pinned: false };
        setActiveNote(newNote as Note); saveNote(newNote.title, newNote.content, undefined, []);
    }
  };

  const addTag = () => { if(!activeNote) return; const tag = prompt("Enter tag name:"); if(tag && !activeNote.tags?.includes(tag)) setActiveNote({ ...activeNote, tags: [...(activeNote.tags || []), tag] }); }
  
  const sortedNotes = notes
    .filter(n => (!filterTag || n.tags?.includes(filterTag)) && (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => (Number(b.is_pinned) - Number(a.is_pinned)) || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || [])));
  const wordCount = activeNote?.content.trim().split(/\s+/).filter(Boolean).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className={`h-full flex gap-6 transition-all duration-700 ${zenMode ? 'fixed inset-0 z-50 bg-[#1e1e2e] p-8' : 'animate-fade-in'}`}>
      
      {/* SIDEBAR LIST */}
      {!zenMode && (
        <TiltCard className="w-1/3 flex flex-col bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="p-5 border-b border-[#313244] space-y-4 z-10 bg-[#1e1e2e]/50">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2"><BookOpen className="text-[#89b4fa]"/> Vault</h2>
                <div className="flex gap-2">
                    <div className="relative">
                        <MagneticButton onClick={() => setShowTemplates(!showTemplates)} className="p-2 bg-[#313244] text-[#a6adc8] rounded-xl hover:text-white transition-all"><LayoutTemplate size={18}/></MagneticButton>
                        {showTemplates && (
                            <div className="absolute right-0 top-12 bg-[#252535] border border-[#313244] rounded-xl shadow-2xl w-48 z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                                {['cornell', 'meeting', 'code'].map(t => (
                                    <button key={t} onClick={() => handleTemplate(t)} className="w-full text-left px-4 py-3 hover:bg-[#89b4fa] hover:text-[#1e1e2e] text-sm text-white capitalize border-b border-[#313244] last:border-0 transition-colors">
                                        {t} Template
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <MagneticButton onClick={handleCreate} className="p-2 bg-[#89b4fa] text-[#1e1e2e] rounded-xl hover:bg-white transition-all shadow-[0_0_15px_rgba(137,180,250,0.4)]"><Plus size={20} /></MagneticButton>
                </div>
            </div>
            
            <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-[#585b70]" />
                <input 
                    placeholder="Search neural vault..." 
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1e1e2e] border border-[#313244] rounded-xl pl-9 pr-3 py-2 text-sm text-white outline-none focus:border-[#89b4fa] transition-all placeholder-[#585b70]"
                />
            </div>

            {allTags.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button onClick={() => setFilterTag('')} className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all whitespace-nowrap ${!filterTag ? 'bg-[#89b4fa] text-[#1e1e2e] border-[#89b4fa]' : 'border-[#313244] text-[#a6adc8]'}`}>ALL</button>
                {allTags.map(tag => <button key={tag} onClick={() => setFilterTag(tag === filterTag ? '' : tag)} className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all whitespace-nowrap ${tag === filterTag ? 'bg-[#89b4fa] text-[#1e1e2e] border-[#89b4fa]' : 'border-[#313244] text-[#a6adc8]'}`}>#{tag}</button>)}
                </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar z-10">
            {sortedNotes.map(note => (
              <div 
                key={note.id} 
                onClick={() => setActiveNote(note)} 
                className={`p-4 rounded-xl border cursor-pointer transition-all group relative overflow-hidden
                    ${activeNote?.id === note.id 
                        ? 'bg-[#1e1e2e] border-[#89b4fa] shadow-lg translate-x-1' 
                        : 'bg-[#252535]/50 border-[#313244] hover:bg-[#1e1e2e] hover:border-[#585b70]'
                    }
                `}
              >
                {activeNote?.id === note.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#89b4fa]" />}
                {note.is_pinned && <Pin size={12} className="absolute top-4 right-4 text-[#f9e2af] rotate-45" fill="currentColor" />}
                <h3 className={`font-bold truncate pr-6 ${activeNote?.id === note.id ? 'text-white' : 'text-[#cdd6f4]'}`}>{note.title || 'Untitled Entry'}</h3>
                <p className="text-xs text-[#a6adc8] mt-1 line-clamp-2 leading-relaxed">{note.content || 'No content...'}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags?.map(tag => <span key={tag} className="text-[9px] font-bold bg-[#313244] px-1.5 py-0.5 rounded text-[#89b4fa] border border-[#45475a]">#{tag}</span>)}
                    <span className="text-[9px] text-[#585b70] ml-auto flex items-center gap-1"><Clock size={8}/> {new Date(note.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {sortedNotes.length === 0 && (
                <EmptyState 
                    title="Vault Empty" 
                    description="No notes found matching your criteria." 
                    icon={Inbox} 
                    className="mt-10"
                />
            )}
          </div>
        </TiltCard>
      )}

      {/* EDITOR AREA */}
      <TiltCard className={`flex-1 flex flex-col bg-[#252535]/80 backdrop-blur-xl rounded-3xl border border-[#313244] shadow-2xl overflow-hidden relative ${zenMode ? 'max-w-5xl mx-auto w-full' : ''}`}>
        {activeNote ? (
          <>
            <div className="h-16 border-b border-[#313244] flex items-center justify-between px-6 bg-[#1e1e2e]/50 z-10">
              <input 
                value={activeNote.title} 
                onChange={(e) => { setActiveNote({ ...activeNote, title: e.target.value }); setAutoSaveStatus('Typing...'); }} 
                placeholder="Entry Title..." 
                className="bg-transparent text-xl font-black text-white outline-none placeholder-[#585b70] w-full" 
              />
              <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                <span className="text-[#a6adc8] transition-colors">{autoSaveStatus}</span>
                <div className="w-px h-4 bg-[#313244] mx-2" />
                <button onClick={startListening} className={`hover:text-white transition-all ${isListening ? 'text-[#f38ba8] animate-pulse' : 'text-[#a6adc8]'}`} title="Voice Dictation">{isListening ? <MicOff size={18} /> : <Mic size={18} />}</button>
                <button onClick={() => setSoundEnabled(!soundEnabled)} className={`hover:text-white transition-all ${soundEnabled ? 'text-[#a6e3a1]' : 'text-[#a6adc8]'}`} title="Keyboard Sounds">{soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
                <button onClick={addTag} className="hover:text-white text-[#a6adc8] transition-all" title="Add Tag"><Tag size={18} /></button>
                <button onClick={() => deleteNote(activeNote.id)} className="hover:text-[#f38ba8] text-[#a6adc8] transition-all" title="Delete"><Trash2 size={18} /></button>
                <button onClick={() => setZenMode(!zenMode)} className="hover:text-white text-[#a6adc8] transition-all" title="Toggle Zen Mode">{zenMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
              </div>
            </div>
            
            <div className="flex-1 flex overflow-hidden z-10">
              <textarea 
                value={activeNote.content} 
                onChange={handleTyping} 
                placeholder="# Write using Markdown... Use [[Title]] to link notes." 
                className="flex-1 bg-[#1e1e2e]/50 p-8 text-[#cdd6f4] outline-none resize-none font-mono leading-relaxed border-r border-[#313244] focus:bg-[#1e1e2e]/80 transition-colors custom-scrollbar text-sm" 
              />
              <div className="hidden lg:block flex-1 bg-[#252535]/30 p-8 overflow-y-auto custom-scrollbar">
                <MarkdownPreview content={activeNote.content} allNotes={notes} onLinkClick={handleLinkClick} />
              </div>
            </div>
            
            <div className="h-8 bg-[#1e1e2e] border-t border-[#313244] flex items-center justify-between px-4 text-[10px] text-[#585b70] z-10">
                <span>Markdown Supported</span>
                <span className="flex items-center gap-4">
                    <span>{wordCount} Words</span>
                    <span>{readTime} Min Read</span>
                </span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#585b70] animate-in zoom-in duration-500">
            <div className="p-8 bg-[#1e1e2e] rounded-full mb-6 border border-[#313244] shadow-xl">
                <FileText size={64} className="opacity-50" />
            </div>
            <p className="text-lg font-bold">Select a node from the vault</p>
            <p className="text-xs mt-2 opacity-50">Or initialize a new entry sequence.</p>
          </div>
        )}
      </TiltCard>
    </div>
  );
}