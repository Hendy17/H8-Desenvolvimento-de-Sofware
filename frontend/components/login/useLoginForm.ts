import { useState } from 'react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import { AuthResponse } from '../../types/shared';
import type { LoginValues } from './types';

export default function useLoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: LoginValues) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await axios.post<AuthResponse>(`${apiUrl}/auth/login`, values, { withCredentials: true });
      
      // Armazenar token se retornado (produção cross-domain)
      if (res.data?.access_token) {
        localStorage.setItem('token', res.data.access_token);
      }
      
      notifications.show({ 
        title: 'Sucesso!', 
        message: `Bem-vindo, ${values.email}`, 
        color: 'green' 
      });
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      notifications.show({ 
        title: 'Erro no login', 
        message: err?.response?.data?.message || 'Credenciais inválidas', 
        color: 'red' 
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, onFinish } as const;
}
