import React, { useState } from 'react';
import { Plus, Trash2, RotateCw, X, Sparkles, Brain, Layers, ArrowLeft, Check, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

export default function FlashcardsModule() {
  const { flashcards, addCard, deleteCard, reviewCard, generateAiCards, translate } = useApp();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [flipped, setFlipped] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isReviewFlipped, setIsReviewFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDeck, setActiveDeck] = useState<string | null>(null);

  // Group by Category
  const decks = Array.from(new Set(flashcards.map(c => c.category || 'Uncategorized')));

  const filteredCards = activeDeck 
    ? flashcards.filter(c => (c.category || 'Uncategorized') === activeDeck)
    : [];

  const dueCards = filteredCards.filter(c => !c.next_review || new Date(c.next_review) <= new Date());

  const handleAdd = async () => {
    if (!front || !back) return;
    await addCard(front, back, activeDeck || 'Uncategorized');
    setFront(''); setBack('');
  };

  const handleAiGenerate = async () => {
    const topic = prompt("Enter a topic to generate cards for (e.g. 'Photosynthesis'):");
    if (!topic) return;
    setIsGenerating(true);
    await generateAiCards(topic);
    setIsGenerating(false);
  };

  const handleReview = async (quality: number) => {
    if (!dueCards[currentReviewIndex]) return;
    await reviewCard(dueCards[currentReviewIndex].id, quality);
    setIsReviewFlipped(false);
    if (currentReviewIndex < dueCards.length - 1) {
      setCurrentReviewIndex(prev => prev + 1);
    } else {
      setReviewMode(false);
      setCurrentReviewIndex(0);
      alert("Neural Reinforcement Complete!");
    }
  };

  // --- DECK SELECTION VIEW ---
  if (!activeDeck) {
    return (
      <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    Neural Cards <span className="text-xs bg-[#89b4fa]/10 text-[#89b4fa] px-2 py-1 rounded border border-[#89b4fa]/20 font-mono tracking-widest">MEMORY</span>
                </h1>
                <p className="text-[#a6adc8] mt-1">Spaced repetition system decks.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {decks.map(deck => {
                const count = flashcards.filter(c => (c.category || 'Uncategorized') === deck).length;
                return (
                    <TiltCard 
                        key={deck} 
                        className="bg-[#252535]/80 backdrop-blur-md p-8 rounded-3xl border border-[#313244] shadow-xl cursor-pointer group hover:border-[#89b4fa]/50 relative overflow-hidden h-48 flex flex-col justify-between"
                    >
                        {/* Interactive Click Handling */}
                        <div className="absolute inset-0 z-20" onClick={() => setActiveDeck(deck)} />
                        
                        <div className="absolute top-0 right-0 p-10 bg-[#89b4fa] blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-[#1e1e2e] rounded-2xl text-[#89b4fa] shadow-lg border border-[#313244] group-hover:scale-110 transition-transform duration-300">
                                <Layers size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white group-hover:text-[#89b4fa] transition-colors">{deck}</h2>
                        </div>
                        <div className="flex justify-between items-end relative z-10">
                            <div className="text-sm font-mono text-[#a6adc8]">{count} Cards</div>
                            <div className="w-8 h-8 rounded-full border border-[#585b70] flex items-center justify-center text-[#585b70] group-hover:bg-[#89b4fa] group-hover:text-[#1e1e2e] group-hover:border-[#89b4fa] transition-all">
                                <ArrowLeft size={16} className="rotate-180" />
                            </div>
                        </div>
                    </TiltCard>
                );
            })}
            
            {/* New Deck Button */}
            <div 
                onClick={() => {
                    const name = prompt("New Deck Name:");
                    if(name) setActiveDeck(name);
                }}
                className="bg-[#1e1e2e]/50 p-8 rounded-3xl border-2 border-dashed border-[#313244] hover:border-[#a6e3a1] cursor-pointer flex flex-col items-center justify-center text-[#585b70] hover:text-[#a6e3a1] transition-all group h-48"
            >
                <div className="p-4 rounded-full bg-[#252535] group-hover:scale-110 transition-transform mb-3">
                    <Plus size={32} />
                </div>
                <span className="font-bold uppercase tracking-widest text-xs">Initialize Deck</span>
            </div>
        </div>
      </div>
    );
  }

  // --- REVIEW MODE ---
  if (reviewMode && dueCards.length > 0) {
    const currentCard = dueCards[currentReviewIndex];
    return (
      <div className="h-full flex flex-col items-center justify-center animate-fade-in max-w-3xl mx-auto relative perspective-1000">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#313244] rounded-full overflow-hidden">
            <div 
                className="h-full bg-[#89b4fa] transition-all duration-300"
                style={{ width: `${((currentReviewIndex + 1) / dueCards.length) * 100}%` }}
            />
        </div>

        <div className="w-full flex justify-between items-center mb-8 mt-6">
          <div className="text-[#a6adc8] font-mono text-sm bg-[#252535] px-3 py-1 rounded-lg border border-[#313244]">
            Card {currentReviewIndex + 1} / {dueCards.length}
          </div>
          <MagneticButton onClick={() => setReviewMode(false)} className="text-[#f38ba8] hover:bg-[#f38ba8]/10 p-2 rounded-xl transition-all">
            <X size={24} />
          </MagneticButton>
        </div>

        <div 
            className="w-full aspect-[16/9] relative cursor-pointer group perspective-1000" 
            onClick={() => setIsReviewFlipped(!isReviewFlipped)}
        >
          <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isReviewFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden bg-[#252535] border border-[#313244] rounded-3xl flex flex-col items-center justify-center p-12 text-center shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#89b4fa]" />
              <Brain className="text-[#89b4fa] mb-6 opacity-50 animate-pulse" size={48} />
              <h2 className="text-4xl font-black text-white leading-tight">{currentCard.front}</h2>
              <div className="absolute bottom-8 text-[#585b70] text-xs uppercase tracking-[0.3em] animate-pulse font-bold">Tap to Decrypt</div>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full backface-hidden bg-[#1e1e2e] border border-[#89b4fa] rounded-3xl flex flex-col items-center justify-center p-12 text-center rotate-y-180 shadow-[0_0_50px_rgba(137,180,250,0.1)]">
              <p className="text-3xl text-[#89b4fa] font-mono leading-relaxed">{currentCard.back}</p>
            </div>
          </div>
        </div>

        {/* Rating Controls */}
        <div className={`mt-12 grid grid-cols-4 gap-4 w-full transition-all duration-500 transform ${isReviewFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          {[
              { label: 'Again', color: '#f38ba8', val: 1 },
              { label: 'Hard', color: '#f9e2af', val: 3 },
              { label: 'Good', color: '#89b4fa', val: 4 },
              { label: 'Easy', color: '#a6e3a1', val: 5 }
          ].map(btn => (
              <MagneticButton 
                key={btn.label}
                onClick={(e: any) => { e.stopPropagation(); handleReview(btn.val); }} 
                className={`p-4 rounded-2xl bg-[${btn.color}]/10 text-[${btn.color}] border border-[${btn.color}]/20 hover:bg-[${btn.color}] hover:text-[#1e1e2e] font-black text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95`}
              >
                {btn.label}
              </MagneticButton>
          ))}
        </div>
      </div>
    );
  }

  // --- DECK VIEW ---
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <MagneticButton onClick={() => setActiveDeck(null)} className="p-3 bg-[#252535] rounded-xl text-[#a6adc8] hover:text-white border border-[#313244] hover:border-[#89b4fa] transition-all">
                <ArrowLeft size={20} />
            </MagneticButton>
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">{activeDeck}</h1>
                <p className="text-[#a6adc8] flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#89b4fa] animate-pulse" /> {filteredCards.length} Data Cards
                </p>
            </div>
        </div>
        <MagneticButton 
          onClick={() => { if (dueCards.length > 0) setReviewMode(true); }}
          disabled={dueCards.length === 0}
          className="flex items-center gap-2 px-8 py-4 bg-[#89b4fa] text-[#1e1e2e] font-bold rounded-2xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(137,180,250,0.4)]"
        >
          <RotateCw size={20} className={dueCards.length > 0 ? "animate-spin-slow" : ""} /> Review Sequence ({dueCards.length})
        </MagneticButton>
      </div>

      {/* INPUT CARD */}
      <TiltCard className="bg-[#252535]/80 backdrop-blur-md p-6 rounded-3xl border border-[#313244] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#89b4fa]/5 via-transparent to-[#89b4fa]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="flex flex-col md:flex-row gap-4 items-center relative z-10">
          <input value={front} onChange={e => setFront(e.target.value)} placeholder="Front (Stimulus)" className="flex-1 bg-[#1e1e2e] p-4 rounded-xl text-white border border-[#313244] focus:border-[#89b4fa] outline-none transition-all placeholder-[#585b70] shadow-inner" />
          <div className="text-[#585b70]"><ArrowLeft size={20} className="rotate-180 md:rotate-0" /></div>
          <input value={back} onChange={e => setBack(e.target.value)} placeholder="Back (Response)" className="flex-1 bg-[#1e1e2e] p-4 rounded-xl text-white border border-[#313244] focus:border-[#a6e3a1] outline-none transition-all placeholder-[#585b70] shadow-inner" />
          
          <div className="flex gap-2">
            <MagneticButton onClick={handleAdd} className="bg-[#89b4fa] text-[#1e1e2e] font-bold p-4 rounded-xl hover:bg-white transition-all shadow-lg"><Plus size={20}/></MagneticButton>
            <MagneticButton 
                onClick={handleAiGenerate} 
                disabled={isGenerating}
                className="flex items-center gap-2 bg-[#cba6f7]/10 text-[#cba6f7] border border-[#cba6f7]/30 px-4 py-4 rounded-xl font-bold hover:bg-[#cba6f7] hover:text-[#1e1e2e] transition-all disabled:opacity-50"
            >
                {isGenerating ? <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> : <Sparkles size={20} />}
            </MagneticButton>
          </div>
        </div>
      </TiltCard>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map(card => (
          <div key={card.id} className="group relative h-56 w-full perspective-1000 cursor-pointer" onClick={() => setFlipped(flipped === card.id ? null : card.id)}>
            <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${flipped === card.id ? 'rotate-y-180' : ''}`}>
              
              {/* Front Preview */}
              <div className="absolute w-full h-full backface-hidden bg-[#252535] border border-[#313244] rounded-3xl p-6 flex flex-col justify-between shadow-lg group-hover:border-[#89b4fa] group-hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start">
                    <Brain className="text-[#89b4fa] opacity-50" size={24} />
                    <span className="text-[10px] bg-[#1e1e2e] text-[#a6adc8] px-2 py-1 rounded border border-[#313244]">Lvl {card.mastery}</span>
                </div>
                <h3 className="text-xl font-bold text-white line-clamp-3 text-center">{card.front}</h3>
                <div className="text-center text-[#585b70] text-xs uppercase tracking-widest font-bold">Flip Card</div>
              </div>

              {/* Back Preview */}
              <div className="absolute w-full h-full backface-hidden bg-[#1e1e2e] border border-[#a6e3a1] rounded-3xl p-6 flex flex-col justify-center items-center text-center rotate-y-180 shadow-2xl">
                <p className="text-xl font-mono text-[#a6e3a1] line-clamp-4">{card.back}</p>
                <button onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }} className="absolute bottom-4 right-4 p-2 hover:bg-[#f38ba8]/20 rounded-lg text-[#f38ba8] transition-colors"><Trash2 size={16} /></button>
              </div>

            </div>
          </div>
        ))}
      </div>
      <style>{`.perspective-1000 { perspective: 1000px; } .preserve-3d { transform-style: preserve-3d; } .backface-hidden { backface-visibility: hidden; } .rotate-y-180 { transform: rotateY(180deg); }`}</style>
    </div>
  );
}