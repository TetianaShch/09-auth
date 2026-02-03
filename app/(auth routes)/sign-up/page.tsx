'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { register } from '@/lib/api/clientApi';
import css from './SignUpPage.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      await register({ email, password });
      router.push('/profile');
    } catch {
      setError(true);
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>Error</p>}
      </form>
    </main>
  );
}
