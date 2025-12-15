import React, { useState } from 'react';
import { Brain, Play, CheckCircle, XCircle, ArrowRight, Zap, Target, Award } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

export default function QuizModule() {
  const { quizzes, generateQuiz, addXp } = useApp();
  const [inputText, setInputText] = useState('');
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeQuiz = quizzes.find(q => q.id === activeQuizId);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    await generateQuiz(inputText); // Assumed to be async in updated context
    setIsGenerating(false);
    setInputText('');
  };

  const handleAnswer = (optionIndex: number) => {
    if (!activeQuiz) return;
    const currentQ = activeQuiz.questions[currentQuestionIndex];
    if (optionIndex === currentQ.correctAnswer) {
      setScore(s => s + 1);
    }

    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(p => p + 1);
    } else {
      setShowResults(true);
      addXp(score * 20); // Bonus XP
    }
  };

  const resetQuiz = () => {
    setActiveQuizId(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
  };

  // --- QUIZ INTERFACE ---
  if (activeQuiz) {
    if (showResults) {
      return (
        <div className="h-full flex flex-col items-center justify-center animate-in zoom-in duration-500">
          <TiltCard className="bg-[#252535]/80 backdrop-blur-md p-12 rounded-3xl border border-[#313244] shadow-2xl text-center relative overflow-hidden max-w-lg w-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(166,227,161,0.1),transparent_70%)]" />
            
            <div className="w-24 h-24 bg-[#a6e3a1]/20 rounded-full flex items-center justify-center text-[#a6e3a1] mb-6 mx-auto shadow-[0_0_30px_rgba(166,227,161,0.3)] animate-bounce">
              <Award size={48} />
            </div>
            
            <h1 className="text-4xl font-black text-white mb-2">Assessment Complete</h1>
            <p className="text-[#a6adc8] mb-8">Performance Analysis</p>
            
            <div className="text-6xl font-mono font-black text-white mb-8 drop-shadow-lg">
              {score}<span className="text-2xl text-[#585b70]">/{activeQuiz.questions.length}</span>
            </div>
            
            <MagneticButton onClick={resetQuiz} className="bg-[#89b4fa] text-[#1e1e2e] font-bold px-8 py-4 rounded-xl hover:bg-white shadow-[0_0_20px_rgba(137,180,250,0.4)] transition-all w-full">
              Return to Lab
            </MagneticButton>
          </TiltCard>
        </div>
      );
    }

    const question = activeQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto h-full flex flex-col justify-center animate-fade-in relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#252535] rounded-lg text-[#89b4fa]"><Brain size={20}/></div>
                <div>
                    <h3 className="text-sm font-bold text-white">{activeQuiz.title}</h3>
                    <p className="text-xs text-[#a6adc8]">Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</p>
                </div>
            </div>
            <MagneticButton onClick={resetQuiz} className="text-[#f38ba8] hover:bg-[#f38ba8]/10 p-2 rounded-lg"><XCircle size={20}/></MagneticButton>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#313244] rounded-full mb-12 overflow-hidden">
            <div className="h-full bg-[#89b4fa] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <TiltCard className="bg-[#252535]/50 backdrop-blur-md border border-[#313244] p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 bg-[#89b4fa] blur-[100px] opacity-5 group-hover:opacity-10 transition-opacity" />
            
            <h2 className="text-2xl font-bold text-white mb-10 leading-relaxed drop-shadow-md">{question.question}</h2>

            <div className="grid gap-4">
            {question.options.map((opt, i) => (
                <button 
                key={i}
                onClick={() => handleAnswer(i)}
                className="p-5 rounded-2xl bg-[#1e1e2e] border border-[#313244] text-left text-[#cdd6f4] hover:border-[#89b4fa] hover:bg-[#89b4fa]/5 hover:translate-x-2 transition-all flex items-center group/opt"
                >
                <span className="w-8 h-8 rounded-lg bg-[#313244] flex items-center justify-center font-bold text-[#89b4fa] mr-4 group-hover/opt:bg-[#89b4fa] group-hover/opt:text-[#1e1e2e] transition-colors">
                    {String.fromCharCode(65 + i)}
                </span>
                <span className="text-lg">{opt}</span>
                </button>
            ))}
            </div>
        </TiltCard>
      </div>
    );
  }

  // --- GENERATOR INTERFACE ---
  return (
    <div className="space-y-8 animate-fade-in h-full flex flex-col pb-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#89b4fa]/10 text-[#89b4fa] text-xs font-bold border border-[#89b4fa]/20 mb-4">
            <Zap size={12} /> AI ASSESSMENT GENERATOR
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Neural Quiz Architect</h1>
        <p className="text-[#a6adc8]">Transform raw data into active recall protocols.</p>
      </div>

      <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full items-center justify-center">
        <TiltCard className="w-full bg-[#252535]/80 backdrop-blur-md p-2 rounded-3xl border border-[#313244] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#89b4fa]/10 via-transparent to-[#a6e3a1]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your notes, essay, or raw text here to generate a comprehensive quiz..."
                className="w-full bg-[#1e1e2e] p-8 rounded-2xl text-white resize-none outline-none focus:bg-[#181825] transition-colors shadow-inner h-64 text-lg leading-relaxed placeholder-[#585b70] border border-transparent focus:border-[#89b4fa]/30"
            />
        </TiltCard>
        
        <MagneticButton 
            onClick={handleGenerate} 
            disabled={!inputText || isGenerating} 
            className="w-full max-w-md py-5 bg-gradient-to-r from-[#89b4fa] to-[#b4befe] text-[#1e1e2e] font-black text-lg rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(137,180,250,0.4)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
        >
            {isGenerating ? (
                <>
                    <div className="w-5 h-5 border-3 border-[#1e1e2e] border-t-transparent rounded-full animate-spin" /> 
                    PROCESSING NEURAL DATA...
                </>
            ) : (
                <>
                    <Brain size={24} /> INITIALIZE GENERATION
                </>
            )}
        </MagneticButton>
      </div>

      {quizzes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#313244] pt-8">
          {quizzes.map(quiz => (
            <TiltCard key={quiz.id} className="bg-[#1e1e2e] p-6 rounded-2xl border border-[#313244] hover:border-[#89b4fa] transition-all group relative overflow-hidden cursor-default">
              <div className="absolute top-0 right-0 p-8 bg-[#89b4fa] blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity" />
              
              <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 rounded-xl bg-[#252535] text-[#89b4fa] group-hover:scale-110 transition-transform shadow-lg border border-[#313244]">
                      <Target size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1 group-hover:text-[#89b4fa] transition-colors">{quiz.title}</h3>
                    <div className="text-xs text-[#585b70]">{quiz.questions.length} Questions</div>
                  </div>
              </div>
              
              <div className="mt-6 flex justify-end relative z-10">
                <MagneticButton onClick={() => setActiveQuizId(quiz.id)} className="bg-[#89b4fa] text-[#1e1e2e] px-4 py-2 rounded-lg font-bold text-xs hover:bg-white transition-all shadow-lg flex items-center gap-2">
                  <Play size={12} fill="currentColor" /> START
                </MagneticButton>
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
}