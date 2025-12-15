import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from './Button';
import { CheckCircle, Terminal, Layers, Globe, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    title: 'Welcome to StudyHub',
    desc: 'You have just initialized the most advanced productivity operating system available to students and engineers.',
    icon: <Terminal size={64} className="text-[#89b4fa]" />
  },
  {
    title: 'Mission Control',
    desc: 'Your Dashboard tracks every metric. XP, Level, Hydration, and Tasks. Everything you do feeds into your stats.',
    icon: <Layers size={64} className="text-[#a6e3a1]" />
  },
  {
    title: 'Global Network',
    desc: 'You are not alone. Connect with other engineers in the Social Hub, compete on the Leaderboard, and sync with the AI.',
    icon: <Globe size={64} className="text-[#f9e2af]" />
  },
];

export const OnboardingTour = () => {
  const { profile, completeOnboarding } = useApp();
  const [step, setStep] = useState(0);

  if (!profile || profile.has_seen_onboarding) return null;

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl max-w-lg w-full p-8 text-center relative overflow-hidden shadow-2xl">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-[#313244] w-full">
          <div 
            className="h-full bg-[#89b4fa] transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="mb-8 flex justify-center animate-in zoom-in duration-300" key={step}>
          {currentStep.icon}
        </div>

        <h2 className="text-3xl font-black text-white mb-4 tracking-tight animate-in slide-in-from-bottom-2 duration-300" key={`h-${step}`}>
          {currentStep.title}
        </h2>
        
        <p className="text-[#a6adc8] mb-8 leading-relaxed animate-in slide-in-from-bottom-4 duration-300" key={`p-${step}`}>
          {currentStep.desc}
        </p>

        <div className="flex gap-4 justify-center">
          {!isLast && (
             <button 
               onClick={completeOnboarding} 
               className="text-[#585b70] hover:text-white text-sm font-bold px-4"
             >
               Skip Protocol
             </button>
          )}
          <Button onClick={handleNext} className="px-8 py-3 text-lg">
            {isLast ? "Initialize System" : "Next Phase"} <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};