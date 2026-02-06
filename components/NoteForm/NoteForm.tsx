'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNote } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';

import css from './NoteForm.module.css';

type Draft = {
  title: string;
  content: string;
  tag: NoteTag;
};

const initialDraft: Draft = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState<Draft>(initialDraft);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setDraft(initialDraft);
      router.push('/notes/filter/all');
    },
  });

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = e => {
    const { name, value } = e.target;
    setDraft(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    mutation.mutate({
      title: draft.title.trim(),
      content: draft.content.trim(),
      tag: draft.tag,
    });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label>Title</label>
        <input name="title" value={draft.title} onChange={handleChange} required />
      </div>

      <div className={css.formGroup}>
        <label>Content</label>
        <textarea name="content" value={draft.content} onChange={handleChange} required />
      </div>

      <div className={css.formGroup}>
        <label>Tag</label>
        <select name="tag" value={draft.tag} onChange={handleChange}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create'}
        </button>

        <button type="button" onClick={() => router.back()} disabled={mutation.isPending}>
          Cancel
        </button>
      </div>

      {mutation.isError && <p>Something went wrong. Try again.</p>}
    </form>
  );
}
