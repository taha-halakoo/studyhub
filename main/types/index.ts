import React from 'react';

export interface User {
  id: string;
  email?: string;
}

// Aliases for compatibility with AppContext
export type UserProfile = Profile;
export type CustomTheme = Theme;
export type GradedAssignment = Assignment;

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  type: 'theme' | 'perk';
  value: string;
  owned: boolean;
}

export interface Language {
  id: string;
  label: string;
  code: string;
}

export interface Quest {
  id: string;
  title: string;
  progress: number;
  target: number;
  reward_xp: number;
  is_claimed: boolean;
  type: 'daily' | 'weekly' | 'special';
}

export interface Notification {
  id: string;
  title: string;
  content?: string;
  message?: string; // Add message for compatibility
  created_at: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  username?: string; // For social notifications
}

export interface Profile {
  id: string;
  username: string; // Codename
  full_name?: string;
  real_name?: string;
  surname?: string;
  title?: string;
  level: number;
  xp: number;
  active_theme: string;
  streak: number;
  hydration: {
    count: number;
    daily_goal: number;
    last_logged?: string;
  };
  achievements: string[];
  inventory: string[];
  language: string; 
  has_seen_onboarding: boolean;
  
  // Extended Profile
  bio?: string;
  phone?: string;
  dob?: string;
  hobbies?: string[];
  socials?: { platform: string; handle: string; url: string }[];
  codename_changed?: boolean; 
  joined_at?: string;
}

export interface Task {
  id: string;
  title: string;
  completed?: boolean; 
  is_completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  due_date?: string;
  project_id?: string;
  tags?: string[];
  recurrence?: string;
  recurring?: boolean;
  subtasks?: Subtask[];
  is_boss?: boolean;
  boss_hp?: number;
  created_at?: string;
  user_id?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

export interface Goal {
  id: string;
  title: string;
  deadline: string;
  progress: number;
  color: string;
  milestones: { id: string; title: string; completed: boolean }[];
}

export interface TimeBlock {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  title: string;
  color: string;
}

export interface Routine {
  id: string;
  title: string;
  tasks: string[];
  frequency: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  updated_at: string;
  is_pinned?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'Link' | 'Video';
  url: string;
  tags: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  mastery: number; // 0-5
  next_review?: string;
  ease_factor?: number;
  interval?: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number | string;
}

export interface SocialMessage {
  id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
  channel?: string;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completed_dates: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  color: string;
  linked_tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode | string; // Updated to allow string emoji
  xp_reward: number;
  condition: (profile: Profile, stats: any) => boolean;
}

export interface Drawing {
  id: string;
  title: string;
  data: string;
  created_at: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  tags: string[];
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
  };
}

export interface Citation {
  id: string;
  type: 'Book' | 'Website' | 'Journal';
  title: string;
  author: string;
  year: string;
  publisher?: string;
  url?: string;
  format_cache?: { apa: string; mla: string };
}

export interface Course {
  id: string;
  semester_id: string;
  title: string;
  code: string;
  credits: number;
  color: string;
}

export interface Semester {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  weight: number;
  score_obtained: number;
  score_total: number;
  due_date?: string;
}

export interface FocusSession {
  id: string;
  duration: number;
  mode: string;
  completed_at: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
}

// UI Types
export interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}