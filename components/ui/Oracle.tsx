import React, { useState, useEffect } from 'react';
import { 
  Search, Mic, LayoutDashboard, Brain, Plus 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OracleProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (view: string) => void;
}

export const Oracle = ({ isOpen, onClose, navigate }: OracleProps) => {
  const { tasks, notes, addTask } = useApp();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const isTaskCommand = query.toLowerCase().startsWith('/task ') || query.toLowerCase().startsWith('create task ');

  // Filter Logic - NOW SEARCHES CONTENT
  const filteredTasks = tasks.filter((t: any) => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3);
  const filteredNotes = notes.filter((n: any) => 
    n.title.toLowerCase().includes(query.toLowerCase()) || 
    n.content.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Voice Recognition Logic
  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false; recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => { const transcript = event.results[0][0].transcript; setQuery(transcript); };
      recognition.start();
    } else { alert("Voice control not supported in this browser."); }
  };

  const handleEnter = () => {
    if (isTaskCommand) {
      const taskTitle = query.replace(/^\/task |^create task /i, '');
      // UPDATED SIGNATURE: title, priority, due_date, tags, recurrence
      addTask(taskTitle, 'Medium', new Date().toISOString(), [], 'None');
      onClose(); setQuery('');
    } else if (query.toLowerCase().includes('dashboard')) { navigate('dashboard'); onClose();
    } else if (query.toLowerCase().includes('cards')) { navigate('flashcards'); onClose();
    } else if (query.toLowerCase().includes('notes')) { navigate('notes'); onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#1e1e2e] border border-[#313244] rounded-xl shadow-2xl overflow-hidden animate-fade-in ring-1 ring-[#89b4fa]/50">
        
        {/* Input Field */}
        <div className="flex items-center px-4 border-b border-[#313244] h-16">
          <Search className="text-[#a6adc8] w-5 h-5 mr-3" />
          <input 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
            placeholder={isListening ? "Listening..." : "Ask the Oracle..."}
            className="flex-1 bg-transparent text-lg text-white placeholder-[#585b70] outline-none h-full"
          />
          <button 
            onClick={startListening}
            className={`p-2 rounded-lg transition-all ${isListening ? 'bg-[#f38ba8] text-[#1e1e2e] animate-pulse' : 'text-[#a6adc8] hover:bg-[#313244]'}`}
          >
            <Mic size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-2">
          
          {!query && (
            <div className="grid grid-cols-2 gap-2 p-2">
              <button onClick={() => { navigate('dashboard'); onClose(); }} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#313244] text-[#cdd6f4] transition-colors group">
                <LayoutDashboard size={18} className="text-[#89b4fa]" /> <span className="font-medium group-hover:text-white">Dashboard</span>
              </button>
              <button onClick={() => { navigate('flashcards'); onClose(); }} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#313244] text-[#cdd6f4] transition-colors group">
                <Brain size={18} className="text-[#a6e3a1]" /> <span className="font-medium group-hover:text-white">Neural Cards</span>
              </button>
            </div>
          )}

          {isTaskCommand && (
            <div className="p-4 flex items-center gap-3 text-[#a6e3a1] bg-[#a6e3a1]/10 rounded-lg mx-2 border border-[#a6e3a1]/20">
              <Plus size={20} />
              <span className="font-bold">Initialize:</span>
              <span className="text-white">{query.replace(/^\/task |^create task /i, '')}</span>
              <span className="ml-auto text-xs opacity-50">Press Enter</span>
            </div>
          )}

          {/* Search Results */}
          {query && !isTaskCommand && (
            <>
                {filteredNotes.length > 0 && <div className="text-xs font-bold text-[#a6adc8] px-2 mt-2">NOTES</div>}
                {filteredNotes.map((n: any) => (
                    <button key={n.id} onClick={() => { navigate('notes'); onClose(); }} className="w-full text-left p-3 rounded-lg hover:bg-[#313244] group">
                        <div className="text-white font-bold">{n.title}</div>
                        <div className="text-xs text-[#585b70] truncate">{n.content}</div>
                    </button>
                ))}

                {filteredTasks.length > 0 && <div className="text-xs font-bold text-[#a6adc8] px-2 mt-2">TASKS</div>}
                {filteredTasks.map((t: any) => (
                    <button key={t.id} onClick={() => { navigate('tasks'); onClose(); }} className="w-full text-left p-3 rounded-lg hover:bg-[#313244] group flex justify-between">
                        <span className={t.is_completed ? "text-[#585b70] line-through" : "text-white"}>{t.title}</span>
                    </button>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};