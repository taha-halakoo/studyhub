import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Task, Project, Goal, Routine, TimeBlock } from '../types';

interface TaskState {
  tasks: Task[];
  projects: Project[];
  goals: Goal[];
  routines: Routine[];
  timeBlocks: TimeBlock[];

  fetchTasks: (userId: string) => Promise<void>;
  
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  addProject: (project: Project, userId: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addGoal: (goal: Goal, userId: string) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  addRoutine: (routine: Routine, userId: string) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  addTimeBlock: (block: TimeBlock, userId: string) => Promise<void>;
  deleteTimeBlock: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set: any, get: any) => ({
  tasks: [],
  projects: [],
  goals: [],
  routines: [],
  timeBlocks: [],

  fetchTasks: async (userId: string) => {
    // 1. Fetch Tasks
    const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', userId);
    if (tasks) set({ tasks });

    // 2. Fetch Projects (Create tables for these in Supabase if not exists)
    const { data: projects } = await supabase.from('projects').select('*').eq('user_id', userId);
    if (projects) set({ projects });

    // 3. Fetch Goals
    const { data: goals } = await supabase.from('goals').select('*').eq('user_id', userId);
    if (goals) set({ goals });
  },

  addTask: async (task: Task) => {
    // Optimistic Update
    set((state: TaskState) => ({ tasks: [...state.tasks, task] }));
    // DB Sync
    const { error } = await supabase.from('tasks').insert([task]);
    if (error) console.error("Task sync failed", error);
  },
  
  updateTask: async (id: string, updates: Partial<Task>) => {
    set((state: TaskState) => ({
      tasks: state.tasks.map((t: Task) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    await supabase.from('tasks').update(updates).eq('id', id);
  },

  deleteTask: async (id: string) => {
    set((state: TaskState) => ({
      tasks: state.tasks.filter((t: Task) => t.id !== id),
    }));
    await supabase.from('tasks').delete().eq('id', id);
  },

  addProject: async (project: Project, userId: string) => {
    set((state: TaskState) => ({ projects: [...state.projects, project] }));
    // Ensure you add 'user_id' to your 'projects' table in Supabase
    await supabase.from('projects').insert([{ ...project, user_id: userId }]);
  },
  
  deleteProject: async (id: string) => {
    set((state: TaskState) => ({ projects: state.projects.filter((p: Project) => p.id !== id) }));
    await supabase.from('projects').delete().eq('id', id);
  },

  addGoal: async (goal: Goal, userId: string) => {
    set((state: TaskState) => ({ goals: [...state.goals, goal] }));
    await supabase.from('goals').insert([{ ...goal, user_id: userId }]);
  },
  
  updateGoal: async (id: string, updates: Partial<Goal>) => {
    set((state: TaskState) => ({
      goals: state.goals.map((g: Goal) => g.id === id ? { ...g, ...updates } : g)
    }));
    await supabase.from('goals').update(updates).eq('id', id);
  },
  
  deleteGoal: async (id: string) => {
    set((state: TaskState) => ({ goals: state.goals.filter((g: Goal) => g.id !== id) }));
    await supabase.from('goals').delete().eq('id', id);
  },

  addRoutine: async (routine: Routine, userId: string) => {
    set((state: TaskState) => ({ routines: [...state.routines, routine] }));
    await supabase.from('routines').insert([{ ...routine, user_id: userId }]);
  },
  
  deleteRoutine: async (id: string) => {
    set((state: TaskState) => ({ routines: state.routines.filter((r: Routine) => r.id !== id) }));
    await supabase.from('routines').delete().eq('id', id);
  },

  addTimeBlock: async (block: TimeBlock, userId: string) => {
    set((state: TaskState) => ({ timeBlocks: [...state.timeBlocks, block] }));
    await supabase.from('time_blocks').insert([{ ...block, user_id: userId }]);
  },
  
  deleteTimeBlock: async (id: string) => {
    set((state: TaskState) => ({ timeBlocks: state.timeBlocks.filter((b: TimeBlock) => b.id !== id) }));
    await supabase.from('time_blocks').delete().eq('id', id);
  },
}));