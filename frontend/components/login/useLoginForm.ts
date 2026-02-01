import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import { LoginResponse } from '@shared/types';
import type { LoginValues } from './types';

export default function useLoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: LoginValues) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await axios.post<LoginResponse>(`${apiUrl}/auth/login`, values, { withCredentials: true });
      
      // Armazenar token se retornado (produção cross-domain)
      if (res.data?.access_token) {
        localStorage.setItem('token', res.data.access_token);
      }
      
      message.success(`Bem-vindo, ${values.email}`);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || 'Erro no login');
    } finally {
      setLoading(false);
    }
  };

  return { loading, onFinish } as const;
}
