import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Hash, Edit2, Save, X, Globe, Linkedin, Github, Instagram, Twitter, Shield, BadgeCheck, Lock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { TiltCard } from '../../ui/TiltCard';
import { MagneticButton } from '../../ui/MagneticButton';

const HOBBIES_LIST = [
  'Coding', 'Design', 'Gaming', 'Music', 'Reading', 'Fitness', 'Travel', 'Art', 'Science', 'Tech', 'AI', 'Space'
];

interface EditProfileState {
  username: string;
  real_name: string;
  surname: string;
  bio: string;
  phone: string;
  dob: string;
  hobbies: string[];
  socials: { platform: string; handle: string; url: string }[];
}

export default function ProfileModule() {
  const { user, profile, updateProfile, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit State
  const [editForm, setEditForm] = useState<EditProfileState>({
    username: profile?.username || '',
    real_name: profile?.real_name || '',
    surname: profile?.surname || '',
    bio: profile?.bio || '',
    phone: profile?.phone || '',
    dob: profile?.dob || '',
    hobbies: profile?.hobbies || [],
    socials: profile?.socials || []
  });

  const canChangeCodename = !profile?.codename_changed;

  const handleSave = async () => {
    // Validation
    if (editForm.username !== profile?.username && !canChangeCodename) {
      showToast("Codename modification protocol locked.", "error");
      return;
    }

    const updates: any = {
      ...editForm,
      codename_changed: editForm.username !== profile?.username ? true : profile?.codename_changed
    };

    await updateProfile(updates);
    setIsEditing(false);
    showToast("Profile identity updated successfully.", "success");
  };

  const toggleHobby = (hobby: string) => {
    if (editForm.hobbies.includes(hobby)) {
      setEditForm(prev => ({ ...prev, hobbies: prev.hobbies.filter(h => h !== hobby) }));
    } else {
      if (editForm.hobbies.length >= 10) return;
      setEditForm(prev => ({ ...prev, hobbies: [...prev.hobbies, hobby] }));
    }
  };

  return (
    <div className="h-full animate-fade-in pb-12 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            Operative Dossier <span className="text-xs bg-[#89b4fa]/10 text-[#89b4fa] px-2 py-1 rounded border border-[#89b4fa]/20 font-mono tracking-widest">CONFIDENTIAL</span>
          </h1>
          <p className="text-[#a6adc8] mt-1">Identity verification and persona management.</p>
        </div>
        
        {!isEditing ? (
          <MagneticButton onClick={() => setIsEditing(true)} className="bg-[#252535] text-white px-6 py-3 rounded-xl border border-[#313244] hover:border-[#89b4fa] hover:text-[#89b4fa] transition-all flex items-center gap-2">
            <Edit2 size={16} /> Edit Protocol
          </MagneticButton>
        ) : (
          <div className="flex gap-2">
            <MagneticButton onClick={() => setIsEditing(false)} className="bg-[#1e1e2e] text-[#f38ba8] px-6 py-3 rounded-xl border border-[#313244] hover:bg-[#f38ba8]/10 transition-all">
              <X size={16} /> Cancel
            </MagneticButton>
            <MagneticButton onClick={handleSave} className="bg-[#89b4fa] text-[#1e1e2e] font-bold px-6 py-3 rounded-xl hover:bg-white transition-all shadow-lg flex items-center gap-2">
              <Save size={16} /> Save Changes
            </MagneticButton>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ID CARD */}
        <div className="space-y-8">
          <TiltCard className="bg-[#252535]/80 backdrop-blur-xl border border-[#313244] rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#89b4fa]/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#89b4fa] to-transparent opacity-50" />
            
            {/* Avatar Hologram */}
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#89b4fa] to-[#a6e3a1] p-1 shadow-[0_0_30px_rgba(137,180,250,0.3)] mb-6 relative">
              <div className="w-full h-full bg-[#1e1e2e] rounded-xl flex items-center justify-center text-4xl font-black text-white relative overflow-hidden">
                {profile?.username?.charAt(0) || 'U'}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-[#1e1e2e] text-[#a6e3a1] text-xs font-bold px-3 py-1 rounded-full border border-[#a6e3a1] shadow-lg">
                LVL {profile?.level}
              </div>
            </div>

            <h2 className="text-3xl font-black text-white mb-1">{profile?.username}</h2>
            <p className="text-[#a6adc8] text-sm uppercase tracking-widest mb-6">{profile?.title || 'System Operative'}</p>

            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 text-sm text-[#cdd6f4] bg-[#1e1e2e]/50 p-3 rounded-xl border border-[#313244]">
                <Mail size={16} className="text-[#89b4fa]" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#cdd6f4] bg-[#1e1e2e]/50 p-3 rounded-xl border border-[#313244]">
                <Phone size={16} className="text-[#a6e3a1]" />
                <span className="truncate">{profile?.phone || 'No Secure Line'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#cdd6f4] bg-[#1e1e2e]/50 p-3 rounded-xl border border-[#313244]">
                <Calendar size={16} className="text-[#f9e2af]" />
                <span className="truncate">{profile?.dob ? new Date(profile.dob).toLocaleDateString() : 'Date Unknown'}</span>
              </div>
            </div>
          </TiltCard>

          {/* Social Links */}
          <TiltCard className="bg-[#252535]/80 backdrop-blur-xl border border-[#313244] rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Globe size={18} className="text-[#89b4fa]" /> Net Connections
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {['github', 'linkedin', 'twitter', 'instagram'].map(platform => {
                const connected = editForm.socials.find(s => s.platform === platform);
                return (
                  <button 
                    key={platform}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${connected ? 'bg-[#89b4fa]/20 text-[#89b4fa] border border-[#89b4fa]/50' : 'bg-[#1e1e2e] text-[#585b70] border border-[#313244]'}`}
                    title={platform}
                  >
                    {platform === 'github' && <Github size={20} />}
                    {platform === 'linkedin' && <Linkedin size={20} />}
                    {platform === 'twitter' && <Twitter size={20} />}
                    {platform === 'instagram' && <Instagram size={20} />}
                  </button>
                );
              })}
            </div>
          </TiltCard>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Identity Form */}
          <TiltCard className="bg-[#1e1e2e] border border-[#313244] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <h3 className="font-black text-white mb-6 flex items-center gap-2 text-lg">
              <Shield size={20} className="text-[#f9e2af]" /> Biometrics & Identity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2 ml-1">Real Name</label>
                <input 
                  disabled={!isEditing}
                  value={editForm.real_name}
                  onChange={e => setEditForm({...editForm, real_name: e.target.value})}
                  className="w-full bg-[#252535] p-4 rounded-xl text-white border border-[#313244] focus:border-[#89b4fa] outline-none disabled:opacity-50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2 ml-1">Surname</label>
                <input 
                  disabled={!isEditing}
                  value={editForm.surname}
                  onChange={e => setEditForm({...editForm, surname: e.target.value})}
                  className="w-full bg-[#252535] p-4 rounded-xl text-white border border-[#313244] focus:border-[#89b4fa] outline-none disabled:opacity-50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2 ml-1 flex justify-between">
                  Codename 
                  {!canChangeCodename && <span className="text-[#f38ba8] flex items-center gap-1"><Lock size={10}/> LOCKED</span>}
                </label>
                <input 
                  disabled={!isEditing || !canChangeCodename}
                  value={editForm.username}
                  onChange={e => setEditForm({...editForm, username: e.target.value})}
                  className={`w-full bg-[#252535] p-4 rounded-xl text-white border outline-none transition-all
                    ${!canChangeCodename ? 'border-[#f38ba8]/30 cursor-not-allowed text-[#a6adc8]' : 'border-[#313244] focus:border-[#89b4fa]'}
                  `}
                />
                {isEditing && canChangeCodename && <p className="text-[10px] text-[#f38ba8] mt-1 ml-1">* Can only be changed ONCE.</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2 ml-1">Date of Birth</label>
                <input 
                  type="date"
                  disabled={!isEditing}
                  value={editForm.dob || ''}
                  onChange={e => setEditForm({...editForm, dob: e.target.value})}
                  className="w-full bg-[#252535] p-4 rounded-xl text-white border border-[#313244] focus:border-[#89b4fa] outline-none disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            <div className="mt-6">
                <label className="block text-xs font-bold text-[#a6adc8] uppercase mb-2 ml-1">Psych Profile (Bio)</label>
                <textarea 
                  disabled={!isEditing}
                  value={editForm.bio}
                  onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full bg-[#252535] p-4 rounded-xl text-white border border-[#313244] focus:border-[#89b4fa] outline-none disabled:opacity-50 transition-all h-32 resize-none leading-relaxed"
                  placeholder="Describe your operational parameters..."
                />
            </div>
          </TiltCard>

          {/* Interests */}
          <TiltCard className="bg-[#1e1e2e] border border-[#313244] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <h3 className="font-black text-white mb-6 flex items-center gap-2 text-lg">
              <Hash size={20} className="text-[#a6e3a1]" /> Interest Matrix
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {HOBBIES_LIST.map(hobby => {
                const isSelected = editForm.hobbies.includes(hobby);
                return (
                  <button 
                    key={hobby}
                    disabled={!isEditing}
                    onClick={() => toggleHobby(hobby)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all
                      ${isSelected 
                        ? 'bg-[#a6e3a1] text-[#1e1e2e] border-[#a6e3a1] shadow-[0_0_10px_rgba(166,227,161,0.4)]' 
                        : 'bg-[#252535] text-[#a6adc8] border-[#313244] hover:bg-[#313244]/80'
                      }
                      ${!isEditing && !isSelected ? 'opacity-50 cursor-default' : ''}
                    `}
                  >
                    {hobby}
                  </button>
                );
              })}
            </div>
            {isEditing && <p className="text-[10px] text-[#585b70] mt-4 text-right">Max 10 Selections</p>}
          </TiltCard>

        </div>
      </div>
    </div>
  );
}