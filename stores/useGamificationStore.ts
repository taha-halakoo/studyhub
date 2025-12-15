import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Skill, Quest, ShopItem, Achievement, UserProfile } from '../types';
import { useAuthStore } from './useAuthStore';
import { useUIStore } from './useUIStore';

// ... (Keep DEFAULT_SKILLS and DEFAULT_SHOP as they were)
const DEFAULT_SKILLS = [
  { id: 'int', name: 'Intelligence', level: 1, xp: 0, color: '#89b4fa', linked_tags: ['coding', 'study'] },
  { id: 'vit', name: 'Vitality', level: 1, xp: 0, color: '#a6e3a1', linked_tags: ['health', 'focus'] },
  { id: 'chr', name: 'Charisma', level: 1, xp: 0, color: '#f9e2af', linked_tags: ['social'] },
  { id: 'dex', name: 'Dexterity', level: 1, xp: 0, color: '#f38ba8', linked_tags: ['art', 'design'] },
];

const DEFAULT_SHOP: ShopItem[] = [
  { id: 't1', title: 'Cyber Dark', description: 'Classic neon aesthetics', cost: 500, type: 'theme', value: 'cyber', owned: true },
  { id: 't2', title: 'Zen Garden', description: 'Calming green interface', cost: 1000, type: 'theme', value: 'zen', owned: false },
  { id: 'p1', title: 'Double XP', description: '2x XP for 24 hours', cost: 2000, type: 'perk', value: 'xp_boost', owned: false },
];

interface GamificationState {
  skills: Skill[];
  quests: Quest[];
  shopItems: ShopItem[];
  achievements: Achievement[];
  habits: any[];
  leaderboard: UserProfile[];

  fetchGamificationData: (userId: string) => Promise<void>;
  fetchLeaderboard: () => Promise<void>; // Added this

  addXp: (amount: number) => void;
  claimQuest: (id: string) => void;
  buyItem: (id: string) => void;
  updateHydration: (amount: number) => void;
  setLeaderboard: (data: UserProfile[]) => void;
  resetDefaults: () => void;
}

export const useGamificationStore = create<GamificationState>((set: any, get: any) => ({
  skills: DEFAULT_SKILLS,
  quests: [
    { id: '1', title: 'Deep Work Session', progress: 0, target: 1, reward_xp: 100, is_claimed: false, type: 'daily' },
    { id: '2', title: 'Complete 3 Tasks', progress: 0, target: 3, reward_xp: 150, is_claimed: false, type: 'daily' },
  ],
  shopItems: DEFAULT_SHOP,
  achievements: [
    { id: 'first_login', title: 'Awakening', description: 'Login to the system for the first time.', xp_reward: 100, icon: '🏆', condition: () => true },
    { id: 'first_task', title: 'Operator', description: 'Complete your first directive.', xp_reward: 50, icon: '✅', condition: () => true },
    { id: 'streak_3', title: 'Consistency', description: 'Maintain a 3-day habit streak.', xp_reward: 300, icon: '🔥', condition: () => true },
    { id: 'quiz_master', title: 'Neural Master', description: 'Score 100% on a quiz.', xp_reward: 500, icon: '🧠', condition: () => true },
  ],
  habits: [],
  leaderboard: [],

  resetDefaults: () => set({ skills: DEFAULT_SKILLS, shopItems: DEFAULT_SHOP }),

  fetchGamificationData: async (userId: string) => {
    const { data: profile } = await supabase.from('profiles').select('inventory').eq('id', userId).single();
    if (profile && profile.inventory) {
        const inventory = profile.inventory as string[];
        set((state: GamificationState) => ({
            shopItems: state.shopItems.map(item => ({
                ...item,
                owned: inventory.includes(item.value) || item.owned
            }))
        }));
    }
  },

  fetchLeaderboard: async () => {
    const { data } = await supabase.from('profiles').select('*').order('xp', { ascending: false }).limit(20);
    if (data) set({ leaderboard: data });
  },

  addXp: (amount: number) => {
    const { profile, updateProfile } = useAuthStore.getState();
    const { addToast } = useUIStore.getState();

    if (profile) {
      const newXp = profile.xp + amount;
      const newLevel = Math.floor(newXp / 500) + 1;
      if (newLevel > profile.level) {
        addToast(`LEVEL UP! RANK ${newLevel} ACHIEVED`, "success");
      }
      updateProfile({ xp: newXp, level: newLevel });
    }
  },

  claimQuest: (id: string) => {
    const state = get();
    const quest = state.quests.find((q: Quest) => q.id === id);
    if (quest && !quest.is_claimed) {
      state.addXp(quest.reward_xp);
      set({
        quests: state.quests.map((q: Quest) => q.id === id ? { ...q, is_claimed: true } : q)
      });
      useUIStore.getState().addToast("Quest Complete: XP Awarded", "success");
    }
  },

  buyItem: (id: string) => {
    const state = get();
    const { profile, updateProfile } = useAuthStore.getState();
    const { addToast } = useUIStore.getState();
    const item = state.shopItems.find((i: ShopItem) => i.id === id);

    if (item && profile && profile.xp >= item.cost) {
      updateProfile({ 
        xp: profile.xp - item.cost, 
        inventory: [...(profile.inventory || []), item.value] 
      });
      set({
        shopItems: state.shopItems.map((i: ShopItem) => i.id === id ? { ...i, owned: true } : i)
      });
      addToast("Item Acquired", "success");
    } else {
      addToast("Insufficient Credits", "error");
    }
  },

  updateHydration: (amount: number) => {
    const { profile, updateProfile } = useAuthStore.getState();
    if (profile) {
      const current = profile.hydration.count;
      const newCount = Math.max(0, current + amount);
      updateProfile({ hydration: { ...profile.hydration, count: newCount } });
    }
  },

  setLeaderboard: (data: UserProfile[]) => set({ leaderboard: data }),
}));