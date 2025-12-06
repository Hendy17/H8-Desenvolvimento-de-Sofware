import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

type User = { id: string; email: string; tenantDbName?: string } | null;

export default function useDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('http://localhost:3001/auth/me', { withCredentials: true });
        if (res.data && res.data.email) {
          setUser(res.data);
        } else {
          router.replace('/login');
        }
      } catch (err) {
        router.replace('/login');
      }
    };
    fetchMe();
  }, [router]);

  const logout = async () => {
    try {
      await axios.post('http://localhost:3001/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      // ignore
    }
    router.replace('/login');
  };

  return { user, logout } as const;
}
