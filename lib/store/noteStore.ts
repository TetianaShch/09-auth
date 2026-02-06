// lib/store/noteStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteTag } from '@/types/note';

type Draft = {
    title: string;
    content: string;
    tag: NoteTag;
};

type NoteState = {
    draft: Draft;
    setDraft: (patch: Partial<Draft>) => void;
    clearDraft: () => void;
};

const initialDraft: Draft = {
    title: '',
    content: '',
    tag: 'Todo',
};

export const useNoteStore = create<NoteState>()(
    persist(
        set => ({
            draft: initialDraft,
            setDraft: patch => set(state => ({ draft: { ...state.draft, ...patch } })),
            clearDraft: () => set({ draft: initialDraft }),
        }),
        { name: 'note-draft' }
    )
);
