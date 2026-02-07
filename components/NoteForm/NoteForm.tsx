'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNote } from '@/lib/api/clientApi';
import { useNoteStore } from '@/lib/store/noteStore';
import type { NoteTag } from '@/types/note';

import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = e => {
    const { name, value } = e.target;

    if (name === 'title') setDraft({ title: value });
    if (name === 'content') setDraft({ content: value });
    if (name === 'tag') setDraft({ tag: value as NoteTag });
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutation.mutate({
      title: draft.title.trim(),
      content: draft.content.trim(),
      tag: draft.tag,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={draft.title} onChange={handleChange} required />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={draft.content}
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" name="tag" value={draft.tag} onChange={handleChange} required>
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

        <button type="button" onClick={handleCancel} disabled={mutation.isPending}>
          Cancel
        </button>
      </div>

      {mutation.isError && <p>Something went wrong. Try again.</p>}
    </form>
  );
}
