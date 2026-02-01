import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import { notifications } from '@mantine/notifications';
import type { RegisterValues } from './types';

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [autoLogging, setAutoLogging] = useState(false);
  const router = useRouter();

  const onFinish = async (values: RegisterValues) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await axios.post(`${apiUrl}/auth/register`, values);
      // after successful registration, attempt auto-login
      setAutoLogging(true);
      try {
            const loginRes = await axios.post(`${apiUrl}/auth/login`, values, { withCredentials: true });
        // backend sets HttpOnly cookie; don't store token in localStorage
        notifications.show({ title: 'Sucesso', message: 'Bem-vindo!', color: 'green' });
        setAutoLogging(false);
        router.push('/dashboard');
      } catch (loginErr: any) {
        setAutoLogging(false);
        notifications.show({ title: 'Sucesso', message: 'Usuário criado. Faça login.', color: 'green' });
        router.push('/login');
      }
    } catch (err: any) {
      console.error(err);
      notifications.show({ title: 'Erro', message: err?.response?.data?.message || 'Erro ao cadastrar', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return { loading, autoLogging, onFinish } as const;
}
