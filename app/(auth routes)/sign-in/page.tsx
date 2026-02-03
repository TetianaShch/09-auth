'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { login } from '@/lib/api/clientApi';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/lib/store/authStore';

import css from './SignInPage.module.css';

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const setUser = useAuthStore(s => s.setUser);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      const user = await login({ email, password });
      setUser(user);
      router.push('/profile');
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Error');
      } else {
        setError('Error');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

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
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
