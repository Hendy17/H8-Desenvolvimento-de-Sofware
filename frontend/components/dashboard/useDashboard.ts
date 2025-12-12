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
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const res = await axios.get(`${apiUrl}/auth/me`, { 
          withCredentials: true,
          headers 
        });
        
        if (res.data && res.data.email) {
          setUser(res.data);
        } else {
          localStorage.removeItem('token');
          router.replace('/login');
        }
      } catch (err) {
        localStorage.removeItem('token');
        router.replace('/login');
      }
    };
    fetchMe();
  }, [router]);

  const logout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.post(`${apiUrl}/auth/logout`, {}, { 
        withCredentials: true,
        headers 
      });
    } catch (err) {
      // ignore
    }
    localStorage.removeItem('token');
    router.replace('/login');
  };

  return { user, logout } as const;
}
