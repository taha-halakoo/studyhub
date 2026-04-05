import React, { useState } from 'react';
import { Palette, Save, Check, Layers, Sliders } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

export default function ThemeForgeModule() {
  const { saveCustomTheme, applyCustomTheme, customThemes, profile } = useApp();
  const [name, setName] = useState('');
  const [colors, setColors] = useState<Record<string, string>>({
    background: '#1e1e2e',
    surface: '#252535',
    primary: '#89b4fa',
    secondary: '#a6e3a1',
    text: '#cdd6f4'
  });

  const handleSave = async () => {
    if (!name.trim()) return;
    await saveCustomTheme(name, colors);
    setName('');
  };

  return (
    <div className="h-full flex gap-8 animate-fade-in pb-6">
      
      {/* EDITOR */}
      <TiltCard className="flex-1 p-8 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#89b4fa] blur-[150px] opacity-10 pointer-events-none" />
        
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <Palette className="text-[#89b4fa]" size={32} /> Theme Forge
                </h1>
                <p className="text-[#a6adc8] mt-2">Architect your visual interface protocol.</p>
            </div>
            <div className="p-3 bg-[#1e1e2e] rounded-2xl border border-[#313244]">
                <Sliders className="text-[#a6adc8]" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 flex-1">
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2 ml-1">Protocol Name</label>
                    <input 
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1e1e2e] p-4 rounded-2xl text-white border border-[#313244] focus:border-[#89b4fa] outline-none transition-all placeholder-[#585b70] shadow-inner"
                    placeholder="e.g. Midnight Protocol"
                    />
                </div>

                <div className="space-y-4">
                    {Object.entries(colors).map(([key, value]) => (
                    <div key={key} className="group">
                        <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2 ml-1 flex justify-between">
                            {key} <span className="font-mono text-[10px] text-[#585b70]">{value}</span>
                        </label>
                        <div className="flex gap-3 items-center bg-[#1e1e2e] p-2 rounded-xl border border-[#313244] group-hover:border-[#89b4fa]/50 transition-colors">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#313244] shrink-0">
                                <input 
                                    type="color" 
                                    value={value} 
                                    onChange={(e) => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                                    className="absolute inset-0 w-[150%] h-[150%] m-[-25%] cursor-pointer p-0"
                                />
                            </div>
                            <input 
                                value={value}
                                onChange={(e) => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                                className="flex-1 bg-transparent text-white text-sm font-mono outline-none"
                            />
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            {/* PREVIEW CARD */}
            <div className="flex flex-col gap-6">
                <div className="text-xs font-bold text-[#a6adc8] uppercase ml-1">Live Simulation</div>
                <div 
                    className="flex-1 rounded-3xl shadow-2xl p-6 flex flex-col gap-4 transition-all duration-500 relative overflow-hidden border" 
                    style={{ backgroundColor: colors.background, borderColor: colors.primary }}
                >
                    {/* Visual Theme Preview */}
                    <div className="absolute top-0 left-0 w-full h-1 transition-colors duration-500" style={{ backgroundColor: colors.primary }} />
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500" style={{ backgroundColor: colors.surface }}>
                                <Layers size={20} style={{ color: colors.primary }} className="transition-colors duration-500" />
                            </div>
                            <div>
                                <div className="font-bold text-lg transition-colors duration-500" style={{ color: colors.text }}>Dashboard</div>
                                <div className="text-xs opacity-80 transition-colors duration-500" style={{ color: colors.secondary }}>System Online</div>
                            </div>
                        </div>
                        {profile?.active_theme === name && name !== '' && (
                            <div className="text-xs px-2 py-1 rounded border transition-colors duration-500" style={{ color: colors.secondary, borderColor: colors.secondary }}>Active</div>
                        )}
                    </div>
                    
                    <div className="p-4 rounded-2xl border border-white/5 relative z-10 transition-colors duration-500" style={{ backgroundColor: colors.surface }}>
                        <div className="text-sm font-bold mb-2 flex justify-between">
                           <span className="transition-colors duration-500" style={{ color: colors.text }}>Active Task</span>
                           <span className="transition-colors duration-500" style={{ color: colors.primary }}>66%</span>
                        </div>
                        <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                            <div className="h-full w-2/3 transition-all duration-500" style={{ backgroundColor: colors.secondary }} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 relative z-10">
                        <div className="p-3 rounded-xl border border-white/5 transition-colors duration-500" style={{ backgroundColor: colors.surface }}>
                            <div className="text-xs mb-1 opacity-70 transition-colors duration-500" style={{ color: colors.text }}>Focus Time</div>
                            <div className="font-bold transition-colors duration-500" style={{ color: colors.primary }}>45m</div>
                        </div>
                        <div className="p-3 rounded-xl border border-white/5 transition-colors duration-500" style={{ backgroundColor: colors.surface }}>
                            <div className="text-xs mb-1 opacity-70 transition-colors duration-500" style={{ color: colors.text }}>Completed</div>
                            <div className="font-bold transition-colors duration-500" style={{ color: colors.secondary }}>12/15</div>
                        </div>
                    </div>

                    <button className="w-full py-3 rounded-xl font-bold text-sm shadow-lg mt-auto relative z-10 transition-all active:scale-95" style={{ backgroundColor: colors.primary, color: colors.background }}>
                        Execute Action
                    </button>
                </div>

                <MagneticButton onClick={handleSave} disabled={!name} className="w-full py-4 rounded-2xl bg-[#89b4fa] text-[#1e1e2e] font-black text-lg hover:bg-white shadow-[0_0_20px_rgba(137,180,250,0.4)] transition-all flex items-center justify-center gap-2">
                    <Save size={20} /> Save Configuration
                </MagneticButton>
            </div>
        </div>
      </TiltCard>

      {/* LIBRARY */}
      <TiltCard className="w-80 flex flex-col gap-4 bg-[#252535]/80 backdrop-blur-xl border border-[#313244] rounded-3xl p-6 shadow-xl h-fit sticky top-0">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Check size={18} className="text-[#a6e3a1]" /> Archive
        </h2>
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
          {customThemes.map(theme => (
            <div 
              key={theme.id} 
              onClick={() => applyCustomTheme(theme)}
              className="p-4 rounded-2xl border border-[#313244] cursor-pointer hover:border-[#89b4fa] transition-all bg-[#1e1e2e] group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="font-bold text-white text-sm">{theme.name}</span>
                <div className="w-2 h-2 rounded-full bg-[#a6e3a1] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_5px_#a6e3a1]" />
              </div>
              <div className="flex gap-2 relative z-10">
                {Object.values(theme.colors).map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          ))}
          {customThemes.length === 0 && (
            <div className="text-center text-[#585b70] text-xs italic py-8 border-2 border-dashed border-[#313244] rounded-xl">No custom themes forged yet.</div>
          )}
        </div>
      </TiltCard>

    </div>
  );
}