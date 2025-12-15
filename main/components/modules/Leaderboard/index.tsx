import React, { useEffect, useState } from 'react';
import { Trophy, Medal, User, Crown, Star, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { TiltCard } from '../../ui/TiltCard';
import { MagneticButton } from '../../ui/MagneticButton';
import { Profile } from '../../../types';

export default function LeaderboardModule() {
  const { leaderboard, profile, fetchLeaderboard } = useApp();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12 relative">
      
      {/* USER SUMMARY MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <TiltCard className="w-full max-w-md bg-[#252535] border border-[#313244] rounded-3xl p-8 relative shadow-2xl flex flex-col items-center">
                <button 
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#313244] text-[#a6adc8] transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#89b4fa] to-[#a6e3a1] flex items-center justify-center text-4xl font-black text-[#1e1e2e] shadow-xl mb-4">
                    {selectedUser.username.charAt(0)}
                </div>
                
                <h2 className="text-2xl font-black text-white">{selectedUser.username}</h2>
                <p className="text-[#a6adc8] text-sm uppercase tracking-widest mb-6">{selectedUser.title || 'Operative'}</p>

                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div className="bg-[#1e1e2e] p-4 rounded-xl text-center border border-[#313244]">
                        <div className="text-[#89b4fa] font-black text-xl">{selectedUser.level}</div>
                        <div className="text-[10px] text-[#585b70] uppercase font-bold">Level</div>
                    </div>
                    <div className="bg-[#1e1e2e] p-4 rounded-xl text-center border border-[#313244]">
                        <div className="text-[#a6e3a1] font-black text-xl">{selectedUser.xp.toLocaleString()}</div>
                        <div className="text-[10px] text-[#585b70] uppercase font-bold">Total XP</div>
                    </div>
                </div>

                <MagneticButton className="w-full bg-[#89b4fa] text-[#1e1e2e] font-bold py-3 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
                    View Full Profile <ArrowRight size={16} />
                </MagneticButton>
            </TiltCard>
        </div>
      )}

      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f9e2af]/10 text-[#f9e2af] text-xs font-black uppercase tracking-[0.2em] border border-[#f9e2af]/20 shadow-[0_0_20px_rgba(249,226,175,0.2)]">
            <Crown size={14} /> Elite Engineers
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">Global Rankings</h1>
        <p className="text-[#a6adc8]">Top performers in the neural network.</p>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="flex justify-center items-end gap-4 md:gap-8 mb-16 h-64">
        {leaderboard.length > 1 && (
            <TiltCard 
                onClick={() => setSelectedUser(leaderboard[1])}
                className="w-1/3 max-w-[200px] h-[70%] bg-[#252535] border-t-4 border-[#a6adc8] rounded-t-3xl flex flex-col items-center justify-end pb-6 relative shadow-[0_0_30px_rgba(166,173,200,0.2)] cursor-pointer hover:brightness-110 transition-all"
            >
                <div className="absolute -top-10 w-16 h-16 rounded-full bg-[#a6adc8] border-4 border-[#1e1e2e] flex items-center justify-center text-[#1e1e2e] font-black text-xl shadow-lg">2</div>
                <div className="text-white font-bold truncate w-full text-center px-2">{leaderboard[1].username}</div>
                <div className="text-[#a6adc8] text-xs font-mono">{leaderboard[1].xp} XP</div>
            </TiltCard>
        )}
        
        {leaderboard.length > 0 && (
            <TiltCard 
                onClick={() => setSelectedUser(leaderboard[0])}
                className="w-1/3 max-w-[220px] h-[100%] bg-gradient-to-b from-[#f9e2af]/20 to-[#252535] border-t-4 border-[#f9e2af] rounded-t-3xl flex flex-col items-center justify-end pb-8 relative shadow-[0_0_50px_rgba(249,226,175,0.3)] z-10 cursor-pointer hover:brightness-110 transition-all"
            >
                <div className="absolute -top-12 w-20 h-20 rounded-full bg-[#f9e2af] border-4 border-[#1e1e2e] flex items-center justify-center text-[#1e1e2e] font-black text-2xl shadow-xl">
                    <Crown size={32} />
                </div>
                <div className="text-white font-black text-lg truncate w-full text-center px-2">{leaderboard[0].username}</div>
                <div className="text-[#f9e2af] font-mono font-bold">{leaderboard[0].xp} XP</div>
            </TiltCard>
        )}

        {leaderboard.length > 2 && (
            <TiltCard 
                onClick={() => setSelectedUser(leaderboard[2])}
                className="w-1/3 max-w-[200px] h-[60%] bg-[#252535] border-t-4 border-[#fab387] rounded-t-3xl flex flex-col items-center justify-end pb-6 relative shadow-[0_0_30px_rgba(250,179,135,0.2)] cursor-pointer hover:brightness-110 transition-all"
            >
                <div className="absolute -top-10 w-16 h-16 rounded-full bg-[#fab387] border-4 border-[#1e1e2e] flex items-center justify-center text-[#1e1e2e] font-black text-xl shadow-lg">3</div>
                <div className="text-white font-bold truncate w-full text-center px-2">{leaderboard[2].username}</div>
                <div className="text-[#fab387] text-xs font-mono">{leaderboard[2].xp} XP</div>
            </TiltCard>
        )}
      </div>

      <TiltCard className="bg-[#252535]/80 backdrop-blur-md border border-[#313244] rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#89b4fa] via-[#f9e2af] to-[#89b4fa] opacity-30" />
        
        <div className="grid grid-cols-12 gap-4 p-5 border-b border-[#313244] text-[10px] font-black text-[#585b70] uppercase tracking-widest bg-[#1e1e2e]/50">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-7">Engineer</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-2 text-right">XP</div>
        </div>

        <div className="divide-y divide-[#313244]">
          {leaderboard.slice(3).map((user, index) => {
            const isMe = user.id === profile?.id;
            const rank = index + 4;
            
            return (
              <div 
                key={user.id} 
                onClick={() => setSelectedUser(user)}
                className={`grid grid-cols-12 gap-4 p-5 items-center transition-all group cursor-pointer
                  ${isMe ? 'bg-[#89b4fa]/10' : 'hover:bg-[#1e1e2e]'}
                `}
              >
                <div className="col-span-1 text-center flex justify-center">
                   <span className="font-mono font-bold text-[#585b70] bg-[#1e1e2e] w-8 h-8 rounded-lg flex items-center justify-center border border-[#313244] group-hover:border-[#89b4fa] group-hover:text-white transition-colors">{rank}</span>
                </div>
                
                <div className="col-span-7 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1e1e2e] border border-[#313244] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <User size={20} className={isMe ? 'text-[#89b4fa]' : 'text-[#585b70]'} />
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${isMe ? 'text-[#89b4fa]' : 'text-white'}`}>
                      {user.username} {isMe && '(You)'}
                    </div>
                    <div className="text-[10px] text-[#a6adc8] uppercase tracking-wide">{user.title}</div>
                  </div>
                </div>

                <div className="col-span-2 text-center font-mono text-sm text-[#cdd6f4] font-bold">
                  {user.level}
                </div>

                <div className="col-span-2 text-right font-mono font-bold text-[#a6e3a1]">
                  {user.xp.toLocaleString()}
                </div>
              </div>
            );
          })}
          
          {leaderboard.length === 0 && (
            <div className="p-8 text-center text-[#585b70]">No data available. Be the first to rank up!</div>
          )}
        </div>
      </TiltCard>
    </div>
  );
}