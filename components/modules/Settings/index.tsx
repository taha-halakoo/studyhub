import React, { useState } from 'react';
import { User, Shield, Save, LogOut, Terminal, Globe, Sliders } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';
import { LANGUAGES } from '../../../lib/i18n';

export default function SettingsModule() {
  const { 
    user, profile, updateProfile, 
    language, setLanguage, translate, showToast, signOut 
  } = useApp();
  
  const [username, setUsername] = useState(profile?.username || '');
  const [title, setTitle] = useState(profile?.title || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile({ username, title });
    setTimeout(() => setIsSaving(false), 500);
    showToast("Profile configurations updated", "success");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      <div className="flex items-center gap-6 border-b border-[#313244] pb-8">
        <TiltCard className="w-24 h-24 bg-gradient-to-br from-[#89b4fa] to-[#a6e3a1] rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-4xl font-black text-[#1e1e2e]">{profile?.level || 1}</span>
        </TiltCard>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            System Core <span className="text-xs bg-[#585b70]/20 text-[#a6adc8] px-2 py-1 rounded border border-[#585b70]/30 font-mono tracking-widest">CONFIG</span>
          </h1>
          <p className="text-[#a6adc8] font-mono mt-1">ID: {user?.id}</p>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Profile Settings */}
        <TiltCard className="bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#89b4fa] blur-[100px] opacity-5 pointer-events-none" />
          
          <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
            <User className="text-[#89b4fa]" /> Identity Matrix
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2 ml-1">Codename</label>
                    <input 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#1e1e2e] p-4 rounded-2xl text-white border border-[#313244] focus:border-[#89b4fa] outline-none font-mono shadow-inner transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2 ml-1">Classification</label>
                    <input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#1e1e2e] p-4 rounded-2xl text-white border border-[#313244] focus:border-[#89b4fa] outline-none font-mono shadow-inner transition-all"
                    />
                </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2 ml-1 flex items-center gap-2"><Globe size={12}/> Language Protocol</label>
              <div className="relative">
                <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#1e1e2e] p-4 rounded-2xl text-white border border-[#313244] focus:border-[#89b4fa] outline-none appearance-none cursor-pointer"
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.id} value={lang.id}>{lang.label}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#a6adc8]"><Sliders size={16}/></div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <MagneticButton onClick={handleSave} className="flex items-center gap-2 bg-[#89b4fa] text-[#1e1e2e] px-8 py-3 rounded-xl font-bold hover:bg-white shadow-[0_0_15px_rgba(137,180,250,0.3)] transition-all">
                <Save size={18} /> {isSaving ? "Overwriting..." : "Save Changes"}
              </MagneticButton>
            </div>
          </div>
        </TiltCard>

        {/* System Stats & Data (Restricted) */}
        <TiltCard className="bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <Terminal className="text-[#a6e3a1]" /> System Metrics
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
            <div className="p-5 bg-[#1e1e2e] rounded-2xl border border-[#313244] hover:border-[#a6e3a1] transition-colors group">
              <div className="text-[10px] text-[#a6adc8] uppercase font-bold tracking-widest mb-1">Total XP</div>
              <div className="text-3xl font-mono font-black text-[#a6e3a1]">{profile?.xp.toLocaleString()}</div>
            </div>
            <div className="p-5 bg-[#1e1e2e] rounded-2xl border border-[#313244] hover:border-[#89b4fa] transition-colors group">
              <div className="text-[10px] text-[#a6adc8] uppercase font-bold tracking-widest mb-1">Level</div>
              <div className="text-3xl font-mono font-black text-[#89b4fa]">{profile?.level}</div>
            </div>
            <div className="p-5 bg-[#1e1e2e] rounded-2xl border border-[#313244] hover:border-[#f9e2af] transition-colors group">
              <div className="text-[10px] text-[#a6adc8] uppercase font-bold tracking-widest mb-1">Next Level</div>
              <div className="text-3xl font-mono font-black text-[#f9e2af]">{(profile?.level || 1) * 500}</div>
            </div>
          </div>
          
          <div className="border-t border-[#313244] pt-4 text-center">
             <p className="text-xs text-[#585b70] italic">
                Data extraction protocols are disabled by administrator policy. 
                All neural data is synced to the central mainframe securely.
             </p>
          </div>
        </TiltCard>

        {/* Danger Zone */}
        <TiltCard className="bg-[#1e1e2e] border border-[#f38ba8]/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#f38ba8]" />
          <div className="absolute inset-0 bg-[#f38ba8]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
            <Shield className="text-[#f38ba8]" /> Security Protocols
          </h2>
          
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h3 className="text-white font-bold">{translate('terminate')}</h3>
              <p className="text-xs text-[#a6adc8] mt-1">End current authentication cycle and clear local cache.</p>
            </div>
            <MagneticButton onClick={signOut} className="bg-[#f38ba8]/10 text-[#f38ba8] border border-[#f38ba8]/20 px-6 py-3 rounded-xl font-bold hover:bg-[#f38ba8] hover:text-[#1e1e2e] transition-all flex items-center gap-2">
              <LogOut size={18} /> Sign Out
            </MagneticButton>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}