'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkSession, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const PRIVATE_PREFIXES = ['/profile', '/notes'];
const AUTH_PAGES = ['/sign-in', '/sign-up'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const setUser = useAuthStore(s => s.setUser);
  const clearIsAuthenticated = useAuthStore(s => s.clearIsAuthenticated);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      try {
        const user = await checkSession();
        const isPrivate = PRIVATE_PREFIXES.some(p => pathname.startsWith(p));
        const isAuthPage = AUTH_PAGES.includes(pathname);

        if (user) {
          setUser(user);
          if (isAuthPage) router.replace('/profile');
        } else {
          clearIsAuthenticated();
          if (isPrivate) {
            await logout();
            router.replace('/sign-in');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
