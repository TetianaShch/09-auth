'use client';

import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import css from './EditProfilePage.module.css';
import { getMe, updateMe } from '@/lib/api/clientApi';
import type { User } from '@/types/user';

export default function ProfileEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<User>({
    queryKey: ['me'],
    queryFn: getMe,
  });

  const mutation = useMutation({
    mutationFn: (payload: { username: string }) => updateMe(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      router.replace('/profile');
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get('username') ?? '').trim();

    if (!username) return;

    mutation.mutate({ username });
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Something went wrong</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={data.avatar ?? '/avatar.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={data.username ?? ''}
            />
          </div>

          <p>Email: {data.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={mutation.isPending}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
