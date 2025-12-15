import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null;

  return (
    <button 
      onClick={handleInstall}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-[#89b4fa] text-[#1e1e2e] px-4 py-3 rounded-full shadow-2xl font-bold animate-bounce"
    >
      <Download size={20} /> Install App
    </button>
  );
};