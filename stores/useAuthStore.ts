import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  initialized: boolean;
  
  // Actions
  setUser: (user: any | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  
  // Async Actions
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  initializeAuth: () => Promise<void>; // New explicit init action
}

export const useAuthStore = create<AuthState>((set: any, get: any) => ({
  user: null,
  profile: null,
  isLoading: true,
  initialized: false,

  setUser: (user: any) => set({ user }),
  setProfile: (profile: UserProfile | null) => set({ profile }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setInitialized: (initialized: boolean) => set({ initialized }),

  // Consolidated Initialization Logic
  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      // 1. Get Session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (!session?.user) {
        // No user, stop loading, let them login
        set({ user: null, profile: null, isLoading: false, initialized: true });
        return;
      }

      // 2. Set User
      set({ user: session.user });

      // 3. Fetch Profile
      await get().fetchProfile(session.user.id);
      
    } catch (error) {
      console.error("Auth Initialization Failed:", error);
      set({ user: null, profile: null });
    } finally {
      // ALWAYS stop loading
      set({ isLoading: false, initialized: true });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const { user, profile } = get();
    if (!user || !profile) return;

    set({ profile: { ...profile, ...updates } });

    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
    } catch (e) {
      console.error("Profile sync failed:", e);
    }
  },

  fetchProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        set({ profile: data });
      } else {
        const newProfile: UserProfile = {
          id: userId,
          username: `Operative-${userId.slice(0,4)}`,
          level: 1,
          xp: 0,
          active_theme: 'cyber',
          streak: 0,
          hydration: { count: 0, daily_goal: 8 },
          achievements: [],
          inventory: [],
          language: 'en',
          has_seen_onboarding: false
        };
        const { error: insertError } = await supabase.from('profiles').insert([newProfile]);
        if (!insertError) set({ profile: newProfile });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }
}));