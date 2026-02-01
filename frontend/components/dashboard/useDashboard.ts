import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User, AuthResponse } from '@shared/types';

export default function useDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const res = await axios.get<User & { authenticated: boolean }>(`${apiUrl}/auth/me`, { 
          withCredentials: true,
          headers 
        });
        
        if (res.data && res.data.email && res.data.authenticated) {
          setUser(res.data);
        } else {
          localStorage.removeItem('token');
          router.replace('/');
        }
      } catch (err) {
        localStorage.removeItem('token');
        router.replace('/');
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
    router.replace('/');
  };

  return { user, logout } as const;
}
