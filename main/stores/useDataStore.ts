import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { 
  JournalEntry, FocusSession, ChatMessage, SocialMessage,
  Semester, Course, Assignment, Quiz 
} from '../types';

interface DataState {
  journalEntries: JournalEntry[];
  focusSessions: FocusSession[];
  aiMessages: ChatMessage[];
  socialMessages: SocialMessage[];
  semesters: Semester[];
  courses: Course[];
  assignments: Assignment[];
  quizzes: Quiz[];

  // Fetch Action
  fetchUserData: (userId: string) => Promise<void>;

  // Actions
  addJournalEntry: (entry: JournalEntry, userId: string) => Promise<void>;
  addFocusSession: (session: FocusSession, userId: string) => Promise<void>;
  addAiMessage: (message: ChatMessage) => void; // AI chat is local for now
  addSocialMessage: (message: SocialMessage) => Promise<void>;
  
  // Academic
  addSemester: (sem: Semester, userId: string) => Promise<void>;
  addCourse: (course: Course, userId: string) => Promise<void>;
  addAssignment: (assign: Assignment, userId: string) => Promise<void>;
  deleteAcademicItem: (type: 'course'|'assignment', id: string) => Promise<void>;
  
  // Quiz
  addQuiz: (quiz: Quiz, userId: string) => Promise<void>;
}

export const useDataStore = create<DataState>((set: any) => ({
  journalEntries: [],
  focusSessions: [],
  aiMessages: [],
  socialMessages: [],
  semesters: [],
  courses: [],
  assignments: [],
  quizzes: [],

  fetchUserData: async (userId: string) => {
    const { data: journal } = await supabase.from('journal').select('*').eq('user_id', userId);
    if (journal) set({ journalEntries: journal });

    const { data: focus } = await supabase.from('focus_sessions').select('*').eq('user_id', userId);
    if (focus) set({ focusSessions: focus });

    const { data: semesters } = await supabase.from('semesters').select('*').eq('user_id', userId);
    if (semesters) set({ semesters });

    const { data: courses } = await supabase.from('courses').select('*').eq('user_id', userId);
    if (courses) set({ courses });

    const { data: assignments } = await supabase.from('assignments').select('*').eq('user_id', userId);
    if (assignments) set({ assignments });

    const { data: quizzes } = await supabase.from('quizzes').select('*').eq('user_id', userId);
    if (quizzes) set({ quizzes });

    // Fetch initial social messages
    const { data: socialMessages } = await supabase
      .from('social_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);
    if (socialMessages) set({ socialMessages });

    // Setup real-time subscription for social_messages
    supabase.channel('social_messages_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'social_messages' },
        (payload) => {
          set((state: DataState) => ({
            socialMessages: [...state.socialMessages, payload.new as SocialMessage]
          }));
        }
      )
      .subscribe();
  },

  addJournalEntry: async (entry: JournalEntry, userId: string) => {
    set((state: DataState) => ({ journalEntries: [...state.journalEntries, entry] }));
    await supabase.from('journal').insert([{ ...entry, user_id: userId }]);
  },

  addFocusSession: async (session: FocusSession, userId: string) => {
    set((state: DataState) => ({ focusSessions: [...state.focusSessions, session] }));
    await supabase.from('focus_sessions').insert([{ ...session, user_id: userId }]);
  },

  addAiMessage: (message: ChatMessage) => set((state: DataState) => ({ aiMessages: [...state.aiMessages, message] })),

  addSocialMessage: async (message: SocialMessage) => {
    // Local state is updated via the real-time subscription
    await supabase.from('social_messages').insert([message]);
  },

  addSemester: async (sem: Semester, userId: string) => {
    set((state: DataState) => ({ semesters: [...state.semesters, sem] }));
    await supabase.from('semesters').insert([{ ...sem, user_id: userId }]);
  },

  addCourse: async (course: Course, userId: string) => {
    set((state: DataState) => ({ courses: [...state.courses, course] }));
    await supabase.from('courses').insert([{ ...course, user_id: userId }]);
  },

  addAssignment: async (assign: Assignment, userId: string) => {
    set((state: DataState) => ({ assignments: [...state.assignments, assign] }));
    await supabase.from('assignments').insert([{ ...assign, user_id: userId }]);
  },
  
  deleteAcademicItem: async (type: 'course'|'assignment', id: string) => {
    set((state: DataState) => ({
      courses: type === 'course' ? state.courses.filter((c: Course) => c.id !== id) : state.courses,
      assignments: type === 'assignment' ? state.assignments.filter((a: Assignment) => a.id !== id) : state.assignments,
    }));
    await supabase.from(type === 'course' ? 'courses' : 'assignments').delete().eq('id', id);
  },

  addQuiz: async (quiz: Quiz, userId: string) => {
    set((state: DataState) => ({ quizzes: [...state.quizzes, quiz] }));
    await supabase.from('quizzes').insert([{ ...quiz, user_id: userId }]);
  },
}));