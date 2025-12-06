import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { message } from 'antd';
import type { RegisterValues } from './types';

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [autoLogging, setAutoLogging] = useState(false);
  const router = useRouter();

  const onFinish = async (values: RegisterValues) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/auth/register', values);
      // after successful registration, attempt auto-login
      setAutoLogging(true);
      try {
            const loginRes = await axios.post('http://localhost:3001/auth/login', values, { withCredentials: true });
        // backend sets HttpOnly cookie; don't store token in localStorage
        message.success('Bem-vindo!');
        setAutoLogging(false);
        router.push('/dashboard');
      } catch (loginErr: any) {
        setAutoLogging(false);
        message.success('Usuário criado. Faça login.');
        router.push('/login');
      }
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return { loading, autoLogging, onFinish } as const;
}
