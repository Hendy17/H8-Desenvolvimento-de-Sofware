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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await axios.get(`${apiUrl}/auth/me`, { withCredentials: true });
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      // ignore
    }
    router.replace('/login');
  };

  return { user, logout } as const;
}
