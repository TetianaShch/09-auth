'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NoteTag } from '../../types/note';
import css from './NoteForm.module.css';

type Draft = {
  title: string;
  content: string;
  tag: string;
};

const initialDraft: Draft = {
  title: '',
  content: '',
  tag: 'Todo',
};

const NoteForm = () => {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(initialDraft);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = e => {
    const { name, value } = e.target;

    setDraft(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (formData: FormData) => {
    const title = String(formData.get('title') ?? '');
    const content = String(formData.get('content') ?? '');
    const tag = String(formData.get('tag') ?? 'Todo') as NoteTag;
    console.log({ title, content, tag });

    setDraft({ title: '', content: '', tag: 'Todo' });
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label>Title</label>
        <input name="title" defaultValue={draft.title} onChange={handleChange} />
      </div>

      <div className={css.formGroup}>
        <label>Content</label>
        <textarea name="content" defaultValue={draft.content} onChange={handleChange} />
      </div>

      <div className={css.formGroup}>
        <label>Tag</label>
        <select name="tag" defaultValue={draft.tag} onChange={handleChange}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit">Create</button>
        <button type="button" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
