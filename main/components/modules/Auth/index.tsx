import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Lock, Mail, ArrowRight, UserPlus, ShieldCheck, Key } from 'lucide-react';
import { BackgroundParticles } from '../../ui/BackgroundParticles';
import { TiltCard } from '../../ui/TiltCard';
import { MagneticButton } from '../../ui/MagneticButton';

export default function AuthModule() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username || `User-${Math.floor(Math.random()*1000)}` }
          }
        });
        if (error) throw error;
        alert("Registration successful! Check your email for the confirmation link.");
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1e1e2e] text-white relative overflow-hidden">
      <BackgroundParticles />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

      <TiltCard className="w-full max-w-md bg-[#252535]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#313244] shadow-2xl relative z-10 animate-fade-in">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#89b4fa] blur-[100px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a6e3a1] blur-[100px] opacity-10 pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#89b4fa] to-[#a6e3a1] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3 group hover:rotate-12 transition-transform duration-500">
            {mode === 'login' ? <Lock size={32} className="text-[#1e1e2e]" /> : <UserPlus size={32} className="text-[#1e1e2e]" />}
          </div>
          <h1 className="text-3xl font-black tracking-tight">StudyHub OS</h1>
          <p className="text-[#a6adc8] text-xs font-bold uppercase tracking-widest mt-2">
            {mode === 'login' ? 'Secure Access Terminal' : 'New Operative Registration'}
          </p>
        </div>

        {error && (
          <div className="bg-[#f38ba8]/10 border border-[#f38ba8]/30 text-[#f38ba8] p-3 rounded-xl text-center text-sm mb-6 animate-pulse font-bold flex items-center justify-center gap-2">
            <ShieldCheck size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          {mode === 'signup' && (
            <div className="group">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Codename (Username)" 
                  className="w-full bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3.5 pl-10 text-white outline-none focus:border-[#89b4fa] transition-all shadow-inner placeholder-[#585b70]"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <ShieldCheck size={18} className="absolute left-3 top-3.5 text-[#585b70] group-focus-within:text-[#89b4fa] transition-colors" />
              </div>
            </div>
          )}

          <div className="group">
            <div className="relative">
              <input 
                type="email" 
                placeholder="Identity (Email)" 
                required 
                className="w-full bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3.5 pl-10 text-white outline-none focus:border-[#89b4fa] transition-all shadow-inner placeholder-[#585b70]"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Mail size={18} className="absolute left-3 top-3.5 text-[#585b70] group-focus-within:text-[#89b4fa] transition-colors" />
            </div>
          </div>

          <div className="group">
            <div className="relative">
              <input 
                type="password" 
                placeholder="Passcode" 
                required 
                className="w-full bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3.5 pl-10 text-white outline-none focus:border-[#89b4fa] transition-all shadow-inner placeholder-[#585b70]"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Key size={18} className="absolute left-3 top-3.5 text-[#585b70] group-focus-within:text-[#89b4fa] transition-colors" />
            </div>
          </div>

          <MagneticButton 
            disabled={loading} 
            className="w-full bg-[#89b4fa] hover:bg-white text-[#1e1e2e] font-black py-4 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(137,180,250,0.3)] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Initialize Session' : 'Create Credentials')} 
            {!loading && <ArrowRight size={18} />}
          </MagneticButton>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            className="text-xs font-bold text-[#a6adc8] hover:text-white uppercase tracking-wider transition-colors"
          >
            {mode === 'login' ? "Don't have an ID? Register" : "Already have access? Login"}
          </button>
        </div>

      </TiltCard>
    </div>
  );
}