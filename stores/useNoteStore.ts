import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Note, Resource, Flashcard, Citation, Drawing, CodeSnippet } from '../types';

interface NoteState {
  notes: Note[];
  resources: Resource[];
  flashcards: Flashcard[];
  citations: Citation[];
  drawings: Drawing[];
  codeSnippets: CodeSnippet[];

  fetchNotes: (userId: string) => Promise<void>;

  addNote: (note: Note, userId: string) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;

  addResource: (resource: Resource, userId: string) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;

  addFlashcard: (card: Flashcard, userId: string) => Promise<void>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  addMultipleFlashcards: (cards: Flashcard[], userId: string) => Promise<void>;

  addCitation: (citation: Citation, userId: string) => Promise<void>;
  deleteCitation: (id: string) => Promise<void>;
  
  addDrawing: (drawing: Drawing, userId: string) => Promise<void>;
  updateDrawing: (id: string, updates: Partial<Drawing>) => Promise<void>;
  deleteDrawing: (id: string) => Promise<void>;
  
  addCodeSnippet: (snippet: CodeSnippet, userId: string) => Promise<void>;
  updateCodeSnippet: (id: string, updates: Partial<CodeSnippet>) => Promise<void>;
  deleteCodeSnippet: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set: any) => ({
  notes: [],
  resources: [],
  flashcards: [],
  citations: [],
  drawings: [],
  codeSnippets: [],

  fetchNotes: async (userId: string) => {
    const { data: notes } = await supabase.from('notes').select('*').eq('user_id', userId);
    if (notes) set({ notes });
    
    const { data: resources } = await supabase.from('resources').select('*').eq('user_id', userId);
    if (resources) set({ resources });

    const { data: flashcards } = await supabase.from('flashcards').select('*').eq('user_id', userId);
    if (flashcards) set({ flashcards });
  },

  addNote: async (note: Note, userId: string) => {
    set((state: NoteState) => ({ notes: [...state.notes, note] }));
    await supabase.from('notes').insert([{ ...note, user_id: userId }]);
  },
  
  updateNote: async (id: string, updates: Partial<Note>) => {
    set((state: NoteState) => ({
      notes: state.notes.map((n: Note) => n.id === id ? { ...n, ...updates } : n)
    }));
    await supabase.from('notes').update(updates).eq('id', id);
  },
  
  deleteNote: async (id: string) => {
    set((state: NoteState) => ({ notes: state.notes.filter((n: Note) => n.id !== id) }));
    await supabase.from('notes').delete().eq('id', id);
  },

  addResource: async (res: Resource, userId: string) => {
    set((state: NoteState) => ({ resources: [...state.resources, res] }));
    await supabase.from('resources').insert([{ ...res, user_id: userId }]);
  },
  
  deleteResource: async (id: string) => {
    set((state: NoteState) => ({ resources: state.resources.filter((r: Resource) => r.id !== id) }));
    await supabase.from('resources').delete().eq('id', id);
  },

  addFlashcard: async (card: Flashcard, userId: string) => {
    set((state: NoteState) => ({ flashcards: [...state.flashcards, card] }));
    await supabase.from('flashcards').insert([{ ...card, user_id: userId }]);
  },
  
  updateFlashcard: async (id: string, updates: Partial<Flashcard>) => {
    set((state: NoteState) => ({
      flashcards: state.flashcards.map((c: Flashcard) => c.id === id ? { ...c, ...updates } : c)
    }));
    await supabase.from('flashcards').update(updates).eq('id', id);
  },
  
  deleteFlashcard: async (id: string) => {
    set((state: NoteState) => ({ flashcards: state.flashcards.filter((c: Flashcard) => c.id !== id) }));
    await supabase.from('flashcards').delete().eq('id', id);
  },
  
  addMultipleFlashcards: async (cards: Flashcard[], userId: string) => {
    set((state: NoteState) => ({ flashcards: [...state.flashcards, ...cards] }));
    const dbCards = cards.map(c => ({ ...c, user_id: userId }));
    await supabase.from('flashcards').insert(dbCards);
  },

  addCitation: async (cit: Citation, userId: string) => {
    set((state: NoteState) => ({ citations: [...state.citations, cit] }));
    // Assuming table 'citations'
    await supabase.from('citations').insert([{ ...cit, user_id: userId }]);
  },
  
  deleteCitation: async (id: string) => {
    set((state: NoteState) => ({ citations: state.citations.filter((c: Citation) => c.id !== id) }));
    await supabase.from('citations').delete().eq('id', id);
  },

  addDrawing: async (drawing: Drawing, userId: string) => {
    set((state: NoteState) => ({ drawings: [...state.drawings, drawing] }));
    await supabase.from('drawings').insert([{ ...drawing, user_id: userId }]);
  },
  
  updateDrawing: async (id: string, updates: Partial<Drawing>) => {
    set((state: NoteState) => ({
      drawings: state.drawings.map((d: Drawing) => d.id === id ? { ...d, ...updates } : d)
    }));
    await supabase.from('drawings').update(updates).eq('id', id);
  },
  
  deleteDrawing: async (id: string) => {
    set((state: NoteState) => ({ drawings: state.drawings.filter((d: Drawing) => d.id !== id) }));
    await supabase.from('drawings').delete().eq('id', id);
  },

  addCodeSnippet: async (snippet: CodeSnippet, userId: string) => {
    set((state: NoteState) => ({ codeSnippets: [...state.codeSnippets, snippet] }));
    await supabase.from('code_snippets').insert([{ ...snippet, user_id: userId }]);
  },
  
  updateCodeSnippet: async (id: string, updates: Partial<CodeSnippet>) => {
    set((state: NoteState) => ({
      codeSnippets: state.codeSnippets.map((s: CodeSnippet) => s.id === id ? { ...s, ...updates } : s)
    }));
    await supabase.from('code_snippets').update(updates).eq('id', id);
  },
  
  deleteCodeSnippet: async (id: string) => {
    set((state: NoteState) => ({ codeSnippets: state.codeSnippets.filter((s: CodeSnippet) => s.id !== id) }));
    await supabase.from('code_snippets').delete().eq('id', id);
  },
}));