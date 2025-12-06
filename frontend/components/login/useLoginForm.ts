import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/router';
import type { LoginValues } from './types';

export default function useLoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: LoginValues) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/auth/login', values, { withCredentials: true });
      // backend sets HttpOnly cookie; just redirect
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
