import React from 'react';
import { ShoppingBag, Star, Shield, Palette, Check, Zap, Package } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { TiltCard } from '../../ui/TiltCard';

export default function ShopModule() {
  const { profile, shopItems, buyItem, equipTheme } = useApp();

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a6e3a1]/10 text-[#a6e3a1] text-xs font-black uppercase tracking-[0.2em] border border-[#a6e3a1]/20 shadow-[0_0_20px_rgba(166,227,161,0.2)]">
            <ShoppingBag size={14} /> Supply Depot
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">The Marketplace</h1>
        
        <div className="inline-flex items-center gap-3 bg-[#252535] px-8 py-4 rounded-2xl border border-[#313244] shadow-xl mt-4">
          <span className="text-xs text-[#a6adc8] font-bold uppercase tracking-widest">Available Credit</span>
          <span className="text-3xl font-mono text-[#a6e3a1] font-black text-shadow-lg">{profile?.xp || 0} XP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shopItems.map((item, idx) => {
          const canAfford = (profile?.xp || 0) >= item.cost;
          const isEquipped = profile?.active_theme === item.value;

          return (
            <TiltCard 
              key={item.id} 
              className={`relative bg-[#252535]/80 backdrop-blur-md border rounded-3xl p-8 transition-all duration-500 group flex flex-col h-[400px]
                ${item.owned ? 'border-[#a6e3a1]/50 shadow-[0_0_30px_rgba(166,227,161,0.1)]' : 'border-[#313244] hover:border-[#89b4fa]/50'}
              `}
            >
              {/* Product Pedestal */}
              <div className="flex-1 flex items-center justify-center relative mb-6">
                <div className="absolute bottom-0 w-32 h-8 bg-black/30 rounded-[100%] blur-md transform scale-y-50 group-hover:scale-110 transition-transform duration-500" />
                <div className={`w-32 h-32 rounded-3xl flex items-center justify-center text-6xl shadow-2xl transform group-hover:-translate-y-4 group-hover:rotate-12 transition-all duration-500 border-4 border-white/10
                    ${item.type === 'theme' ? 'bg-gradient-to-br from-[#cba6f7] to-[#89b4fa] text-[#1e1e2e]' : 'bg-gradient-to-br from-[#f38ba8] to-[#fab387] text-[#1e1e2e]'}
                `}>
                  {item.type === 'theme' ? <Palette size={48} /> : <Zap size={48} />}
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-white leading-tight">{item.title}</h3>
                    {item.owned && (
                        <div className="bg-[#a6e3a1] text-[#1e1e2e] p-1 rounded-full shadow-[0_0_10px_#a6e3a1]">
                            <Check size={14} strokeWidth={4} />
                        </div>
                    )}
                </div>
                
                <p className="text-sm text-[#a6adc8] leading-relaxed min-h-[40px]">{item.description}</p>

                {item.owned ? (
                    item.type === 'theme' ? (
                    <MagneticButton 
                        onClick={() => equipTheme(item.value)}
                        disabled={isEquipped}
                        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all
                            ${isEquipped 
                                ? 'bg-[#313244] text-[#a6adc8] cursor-default border border-[#45475a]' 
                                : 'bg-[#a6e3a1] text-[#1e1e2e] hover:bg-white shadow-[0_0_20px_rgba(166,227,161,0.4)]'
                            }
                        `}
                    >
                        {isEquipped ? 'Active System' : 'Install Protocol'}
                    </MagneticButton>
                    ) : (
                    <div className="w-full py-4 rounded-xl bg-[#252535] text-[#a6adc8] font-bold text-center border border-[#313244] text-xs uppercase tracking-widest cursor-default">
                        In Inventory
                    </div>
                    )
                ) : (
                    <MagneticButton 
                        onClick={() => buyItem(item.id)}
                        disabled={!canAfford}
                        className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2
                            ${canAfford 
                                ? 'bg-[#89b4fa] text-[#1e1e2e] hover:bg-white shadow-[0_0_20px_rgba(137,180,250,0.4)]' 
                                : 'bg-[#1e1e2e] text-[#585b70] border border-[#313244] cursor-not-allowed'
                            }
                        `}
                    >
                        {item.cost} XP
                    </MagneticButton>
                )}
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}