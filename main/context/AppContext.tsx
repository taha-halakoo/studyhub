import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from '../lib/i18n';
import { generateGeminiResponse, cleanAIResponse } from '../lib/ai';

// Import New Stores
import { useAuthStore } from '../stores/useAuthStore';
import { useTaskStore } from '../stores/useTaskStore';
import { useNoteStore } from '../stores/useNoteStore';
import { useUIStore } from '../stores/useUIStore';
import { useGamificationStore } from '../stores/useGamificationStore';
import { useDataStore } from '../stores/useDataStore';

// Types
import { 
  Task, Subtask, Habit, CustomTheme, Goal, Project, TimeBlock, Routine,
  Note, Assignment, Quiz, SocialMessage, UserProfile,
  Citation, Course, Semester, Flashcard, Resource, Drawing, CodeSnippet,
  Notification, ShopItem, Achievement, JournalEntry, FocusSession, ChatMessage
} from '../types';

// --- DEFINING THE CONTRACT ---
interface AppContextType {
  // Auth
  user: any;
  profile: UserProfile | null;
  isLoading: boolean;
  initialized: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;

  // UI
  toasts: { id: string; message: string; type: 'info' | 'success' | 'error' }[];
  notifications: Notification[];
  language: string;
  customThemes: CustomTheme[];
  debugLogs: string[];
  translate: (key: string) => string;
  setLanguage: (lang: string) => void;
  showToast: (msg: string, type: 'info' | 'success' | 'error') => void;
  addLog: (msg: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Data Arrays
  tasks: Task[];
  projects: Project[];
  goals: Goal[];
  routines: Routine[];
  timeBlocks: TimeBlock[];
  notes: Note[];
  resources: Resource[];
  flashcards: Flashcard[];
  citations: Citation[];
  drawings: Drawing[];
  codeSnippets: CodeSnippet[];
  skills: any[]; 
  quests: any[]; 
  shopItems: ShopItem[];
  achievements: Achievement[];
  habits: Habit[];
  leaderboard: UserProfile[];
  journalEntries: JournalEntry[];
  focusSessions: FocusSession[];
  aiMessages: ChatMessage[];
  socialMessages: SocialMessage[];
  semesters: Semester[];
  courses: Course[];
  assignments: Assignment[];
  quizzes: Quiz[];

  // Entity Actions
  addTask: (title: string, priority: string, due_date: string, tags: string[], recurrence: string, project_id?: string, is_boss?: boolean) => Promise<void>;
  toggleTask: (id: string, currentStatus: boolean) => void;
  deleteTask: (id: string) => void;
  updateTaskPriority: (id: string, priority: string) => void;
  addSubtask: (tid: string, title: string) => void;
  toggleSubtask: (tid: string, sid: string) => void;
  
  addProject: (title: string, description: string, color: string, icon: string) => void;
  deleteProject: (id: string) => void;
  
  addGoal: (title: string, deadline: string, color: string) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  addGoalMilestone: (gid: string, title: string) => void;
  toggleGoalMilestone: (gid: string, mid: string) => void;
  
  addTimeBlock: (day: string, start: string, end: string, title: string, color: string) => void;
  deleteTimeBlock: (id: string) => void;
  
  addRoutine: (title: string, tasks: string[], frequency: string) => void;
  deleteRoutine: (id: string) => void;
  executeRoutine: (id: string) => void;

  saveNote: (title: string, content: string, id?: string, tags?: string[]) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  
  addResource: (title: string, type: any, url: string, tags: string[]) => void;
  deleteResource: (id: string) => void;
  
  addCard: (front: string, back: string, category: string) => void;
  deleteCard: (id: string) => void;
  reviewCard: (id: string, quality: number) => void;
  generateAiCards: (topic: string) => Promise<void>;
  
  addCitation: (cit: any) => void;
  deleteCitation: (id: string) => void;
  
  saveDrawing: (title: string, data: string, id?: string) => void;
  deleteDrawing: (id: string) => void;
  
  saveSnippet: (title: string, language: string, code: string, tags: string[], id?: string) => void;
  deleteSnippet: (id: string) => void;

  addSemester: (title: string, start: string, end: string) => void;
  addCourse: (semId: string, title: string, code: string, credits: number, color: string) => void;
  addAssignment: (cid: string, title: string, weight: number, score: number, total: number, dueDate?: string) => void;
  deleteAcademicItem: (type: 'course'|'assignment', id: string) => void;

  saveJournalEntry: (content: string, mood: string) => void;
  
  addHabit: (title: string) => void;
  toggleHabit: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;

  addXp: (amount: number) => void;
  claimQuest: (id: string) => void;
  buyItem: (id: string) => void;
  updateHydration: (amount: number) => void;
  
  logFocusSession: (duration: number, mode: string) => void;
  
  saveCustomTheme: (name: string, colors: any) => void;
  applyCustomTheme: (theme: CustomTheme) => void;
  equipTheme: (val: string) => void;
  
  sendSocialMessage: (content: string, channel: string) => Promise<void>;
  sendAiMessage: (content: string) => Promise<void>;
  generateQuiz: (text: string) => Promise<void>;
  
  exportData: () => void;
  importData: (json: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isLoading, initialized, signOut, updateProfile, fetchProfile, initializeAuth } = useAuthStore();
  const taskState = useTaskStore();
  const noteState = useNoteStore();
  const { toasts, notifications, language, customThemes, debugLogs, addToast, setLanguage, addCustomTheme, addLog, markNotificationRead, clearNotifications, addNotification } = useUIStore();
  const gameState = useGamificationStore();
  const dataState = useDataStore();
  const { t } = useTranslation(language);

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Start Auth Check on Mount
    if (!initialized) {
        initializeAuth();
    }
  }, []);

  // --- DATA SYNC ---
  useEffect(() => {
    if (user && initialized) {
        addLog('Syncing Database...');
        Promise.all([
            taskState.fetchTasks(user.id),
            noteState.fetchNotes(user.id),
            gameState.fetchGamificationData(user.id),
            gameState.fetchLeaderboard(),
            dataState.fetchUserData(user.id),
        ]).then(() => addLog('Sync Complete.'));
    }
  }, [user, initialized]);

  // --- ACTIONS ---

  const addTask = async (title: string, priority: string, due_date: string, tags: string[], recurrence: string, project_id?: string, is_boss: boolean = false) => {
    if (!user) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title, is_completed: false, priority: priority as any, due_date, tags, recurrence, project_id, is_boss,
      boss_hp: is_boss ? 100 : undefined, created_at: new Date().toISOString(), user_id: user.id,
      recurring: recurrence !== 'None'
    };
    await taskState.addTask(newTask);
    addToast("Directive Initialized", "success");
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    await taskState.updateTask(id, { is_completed: !currentStatus });
    if (!currentStatus) gameState.addXp(50);
  };

  const updateTaskPriority = async (id: string, priority: string) => {
    await taskState.updateTask(id, { priority: priority as any });
  };

  const addSubtask = async (tid: string, title: string) => {
    const task = taskState.tasks.find(t => t.id === tid);
    if (task) {
      const subtasks = [...(task.subtasks || []), { id: crypto.randomUUID(), title, completed: false }];
      await taskState.updateTask(tid, { subtasks });
    }
  };

  const toggleSubtask = async (tid: string, sid: string) => {
    const task = taskState.tasks.find(t => t.id === tid);
    if (task) {
      const subtasks = task.subtasks?.map(s => s.id === sid ? { ...s, completed: !s.completed } : s);
      await taskState.updateTask(tid, { subtasks });
    }
  };

  const saveNote = async (title: string, content: string, id?: string, tags: string[] = []) => {
    if (!user) return;
    if (id) {
      await noteState.updateNote(id, { title, content, tags, updated_at: new Date().toISOString() });
    } else {
      await noteState.addNote({ 
        id: crypto.randomUUID(), 
        title, content, tags, 
        updated_at: new Date().toISOString(), 
        is_pinned: false 
      }, user.id);
    }
    addToast("Data Node Encrypted", "success");
  };

  const addResource = async (title: string, type: any, url: string, tags: string[]) => {
    if(!user) return;
    await noteState.addResource({ id: crypto.randomUUID(), title, type, url, tags }, user.id);
    addToast("Source Indexed", "success");
  };

  const addCard = async (front: string, back: string, category: string) => {
    if(!user) return;
    await noteState.addFlashcard({ id: crypto.randomUUID(), front, back, category, mastery: 0, ease_factor: 2.5, interval: 0, next_review: new Date().toISOString() }, user.id);
    addToast("Neural Card Created", "success");
  };

  const reviewCard = async (id: string, quality: number) => {
    const card = noteState.flashcards.find(c => c.id === id);
    if (!card) return;

    let ef = card.ease_factor || 2.5;
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ef < 1.3) ef = 1.3;
    
    let interval = card.interval || 0;
    let repetitions = quality < 3 ? 0 : (card.mastery || 0) + 1;
    
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * ef);
    
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);
    
    await noteState.updateFlashcard(id, { mastery: repetitions, ease_factor: ef, interval, next_review: nextDate.toISOString() });
    gameState.addXp(10);
  };

  const generateAiCards = async (topic: string) => {
    if(!user) return;
    addToast("Generating Neural Data...", "info");
    try {
      const prompt = `Generate 5 flashcards for the topic "${topic}". Return ONLY a JSON array with objects containing "front" and "back" string properties. Do not include markdown formatting.`;
      const responseText = await generateGeminiResponse(prompt);
      const cleanedJson = cleanAIResponse(responseText);
      const newCardsData = JSON.parse(cleanedJson);
      
      if (Array.isArray(newCardsData)) {
        const newCards = newCardsData.map((c: any, i: number) => ({
          id: crypto.randomUUID(),
          front: c.front,
          back: c.back,
          category: topic,
          mastery: 0
        }));
        await noteState.addMultipleFlashcards(newCards, user.id);
        addToast("Generation Complete", "success");
      }
    } catch (e) {
      addToast("AI Generation Failed.", "error");
    }
  };

  const saveJournalEntry = async (content: string, mood: string) => {
    if(!user) return;
    const today = new Date().toISOString().split('T')[0];
    await dataState.addJournalEntry({ id: crypto.randomUUID(), date: today, content, mood }, user.id);
    gameState.addXp(30);
    addToast("Log Entry Saved", "success");
  };

  const [habits, setHabits] = useState<Habit[]>([]);
  const addHabit = (title: string) => setHabits(prev => [...prev, { id: crypto.randomUUID(), title, streak: 0, completed_dates: [] }]);
  const toggleHabit = (id: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const completed = h.completed_dates.includes(date);
      const newDates = completed ? h.completed_dates.filter(d => d !== date) : [...h.completed_dates, date];
      const streak = newDates.length; 
      if (!completed) gameState.addXp(20);
      return { ...h, completed_dates: newDates, streak };
    }));
  };
  const deleteHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));

  const logFocusSession = async (duration: number, mode: string) => {
    if(!user) return;
    await dataState.addFocusSession({ id: crypto.randomUUID(), duration, mode, completed_at: new Date().toISOString() }, user.id);
  };

  const saveDrawing = (title: string, data: string, id?: string) => {
    if(!user) return;
    if (id) noteState.updateDrawing(id, { title, data });
    else noteState.addDrawing({ id: crypto.randomUUID(), title, data, created_at: new Date().toISOString() }, user.id);
    addToast("Schematic Saved", "success");
  };

  const saveSnippet = (title: string, language: string, code: string, tags: string[], id?: string) => {
    if(!user) return;
    if(id) noteState.updateCodeSnippet(id, { title, language, code, tags });
    else noteState.addCodeSnippet({ id: crypto.randomUUID(), title, language, code, tags }, user.id);
    addToast("Code Compiled", "success");
  };

  const saveCustomTheme = (name: string, colors: any) => addCustomTheme({ id: crypto.randomUUID(), name, colors });
  const applyCustomTheme = (theme: CustomTheme) => { if(profile) updateProfile({ active_theme: theme.id }); };
  const equipTheme = (val: string) => { if(profile) updateProfile({ active_theme: val }); };

  const addProject = async (title: string, description: string, color: string, icon: string) => {
    if(!user) return;
    await taskState.addProject({ id: crypto.randomUUID(), title, description, color, icon }, user.id);
  };
  
  const addGoal = async (title: string, deadline: string, color: string) => {
    if(!user) return;
    await taskState.addGoal({ id: crypto.randomUUID(), title, deadline, color, progress: 0, milestones: [] }, user.id);
  };
  
  const addGoalMilestone = (gid: string, title: string) => {
    const goal = taskState.goals.find(g => g.id === gid);
    if(goal) taskState.updateGoal(gid, { milestones: [...goal.milestones, { id: crypto.randomUUID(), title, completed: false }] });
  };
  
  const toggleGoalMilestone = (gid: string, mid: string) => {
    const goal = taskState.goals.find(g => g.id === gid);
    if(goal) taskState.updateGoal(gid, { milestones: goal.milestones.map(m => m.id === mid ? { ...m, completed: !m.completed } : m) });
  };

  const updateGoalProgress = async (id: string, progress: number) => {
    await taskState.updateGoal(id, { progress });
  }

  const addTimeBlock = async (day: string, start: string, end: string, title: string, color: string) => {
    if(!user) return;
    await taskState.addTimeBlock({ id: crypto.randomUUID(), day, start_time: start, end_time: end, title, color }, user.id);
  };
  
  const addRoutine = async (title: string, tasks: string[], frequency: string) => {
    if(!user) return;
    await taskState.addRoutine({ id: crypto.randomUUID(), title, tasks, frequency }, user.id);
  };
  
  const executeRoutine = (id: string) => { 
    const routine = taskState.routines.find((r: Routine) => r.id === id);
    if (routine) {
      routine.tasks.forEach((t: string) => addTask(t, 'Medium', new Date().toISOString(), ['Routine'], 'None'));
      addToast("Routine Protocols Initiated", "success");
    }
  };

  const addSemester = async (title: string, start: string, end: string) => {
    if(!user) return;
    await dataState.addSemester({ id: crypto.randomUUID(), title, start_date: start, end_date: end, is_current: false }, user.id);
  };
  const addCourse = async (semId: string, title: string, code: string, credits: number, color: string) => {
    if(!user) return;
    await dataState.addCourse({ id: crypto.randomUUID(), semester_id: semId, title, code, credits, color }, user.id);
  };
  const addAssignment = async (cid: string, title: string, weight: number, score: number, total: number, dueDate?: string) => {
    if(!user) return;
    await dataState.addAssignment({ id: crypto.randomUUID(), course_id: cid, title, weight, score_obtained: score, score_total: total, due_date: dueDate }, user.id);
  };

  const addCitation = (cit: any) => {
      if(!user) return;
      noteState.addCitation({ id: crypto.randomUUID(), ...cit, format_cache: { apa: `${cit.author} (${cit.year}). ${cit.title}.`, mla: `${cit.author}. ${cit.title}. ${cit.year}.` } }, user.id);
  };

  const sendSocialMessage = async (content: string, channel: string) => {
    const msg = { id: crypto.randomUUID(), user_id: user?.id || 'anon', username: profile?.username || 'Guest', content, created_at: new Date().toISOString(), channel };
    await dataState.addSocialMessage(msg);
  };

  const sendAiMessage = async (content: string) => {
    dataState.addAiMessage({ id: crypto.randomUUID(), role: 'user', content, timestamp: Date.now() });
    try {
      const response = await generateGeminiResponse(content);
      dataState.addAiMessage({ id: crypto.randomUUID() + 'ai', role: 'assistant', content: response, timestamp: Date.now() });
    } catch (e) {
      dataState.addAiMessage({ id: crypto.randomUUID() + 'ai', role: 'assistant', content: "Connection Error.", timestamp: Date.now() });
    }
  };

  const generateQuiz = async (text: string) => {
    if(!user) return;
    addToast("Analyzing Data Structure...", "info");
    try {
      const prompt = `Generate 3 multiple choice quiz questions based on this text: "${text.substring(0, 1000)}". Return ONLY a JSON array. Each object must have: "question" (string), "options" (array of 4 strings), "correctAnswer" (number index 0-3). Do not include markdown.`;
      const responseText = await generateGeminiResponse(prompt);
      const cleanedJson = cleanAIResponse(responseText);
      const questions = JSON.parse(cleanedJson);
      
      if (Array.isArray(questions)) {
        const newQuiz = {
          id: crypto.randomUUID(),
          title: "Generated Assessment",
          questions
        };
        await dataState.addQuiz(newQuiz, user.id);
        addToast("Simulation Ready", "success");
      }
    } catch (e) {
      addToast("Quiz Generation Failed", "error");
    }
  };

  const completeOnboarding = async () => {
    await updateProfile({ has_seen_onboarding: true });
    addToast("System Initialized", "success");
  };

  const value: AppContextType = {
    user, profile, isLoading, initialized, signOut, updateProfile, completeOnboarding, 
    fetchLeaderboard: gameState.fetchLeaderboard, 
    
    toasts, notifications, language, customThemes, debugLogs, translate: t, setLanguage, showToast: addToast, addLog, markNotificationRead, clearNotifications,
    tasks: taskState.tasks,
    projects: taskState.projects,
    goals: taskState.goals,
    routines: taskState.routines,
    timeBlocks: taskState.timeBlocks,
    notes: noteState.notes,
    resources: noteState.resources,
    flashcards: noteState.flashcards,
    citations: noteState.citations,
    drawings: noteState.drawings,
    codeSnippets: noteState.codeSnippets,
    skills: gameState.skills,
    quests: gameState.quests,
    shopItems: gameState.shopItems,
    achievements: gameState.achievements,
    habits,
    leaderboard: gameState.leaderboard,
    journalEntries: dataState.journalEntries,
    focusSessions: dataState.focusSessions,
    aiMessages: dataState.aiMessages,
    socialMessages: dataState.socialMessages,
    semesters: dataState.semesters,
    courses: dataState.courses,
    assignments: dataState.assignments,
    quizzes: dataState.quizzes,
    addTask, toggleTask, deleteTask: taskState.deleteTask, updateTaskPriority, addSubtask, toggleSubtask,
    addProject, deleteProject: taskState.deleteProject,
    addGoal, deleteGoal: taskState.deleteGoal, updateGoalProgress, addGoalMilestone, toggleGoalMilestone,
    addTimeBlock, deleteTimeBlock: taskState.deleteTimeBlock,
    addRoutine, deleteRoutine: taskState.deleteRoutine, executeRoutine,
    saveNote, deleteNote: noteState.deleteNote, togglePinNote: (id: string) => { const n = noteState.notes.find((n: Note) => n.id === id); if(n) noteState.updateNote(id, {is_pinned:!n.is_pinned}); },
    addResource, deleteResource: noteState.deleteResource,
    addCard, deleteCard: noteState.deleteFlashcard, reviewCard, generateAiCards,
    addCitation, deleteCitation: noteState.deleteCitation,
    saveDrawing, deleteDrawing: noteState.deleteDrawing,
    saveSnippet, deleteSnippet: noteState.deleteCodeSnippet,
    addSemester, addCourse, addAssignment, deleteAcademicItem: dataState.deleteAcademicItem,
    saveJournalEntry,
    addHabit, toggleHabit, deleteHabit,
    addXp: gameState.addXp, claimQuest: gameState.claimQuest, buyItem: gameState.buyItem, updateHydration: gameState.updateHydration,
    logFocusSession,
    saveCustomTheme, applyCustomTheme, equipTheme,
    sendSocialMessage, sendAiMessage, generateQuiz,
    exportData: () => addToast("Disabled by Security Protocol", "error"),
    importData: async () => addToast("Disabled by Security Protocol", "error"),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};