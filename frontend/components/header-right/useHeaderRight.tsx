import { useState, useCallback } from 'react';
import axios from 'axios';
import { notification } from 'antd';

export default function useHeaderRight() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<any | null>(null);

  const open = useCallback(() => {
    setClient(null);
    setVisible(true);
  }, []);
  const close = useCallback(() => setVisible(false), []);

  const search = async (cnpj: string) => {
    const normalized = (cnpj || '').replace(/\D/g, '');
    if (!normalized) {
      notification.warning({ message: 'CNPJ inválido' });
      return null;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3001/clients/search`, { params: { cnpj: normalized } });
      setClient(res.data);
      notification.success({ message: 'Cliente encontrado' });
      return res.data;
    } catch (err: any) {
      setClient(null);
      notification.error({ message: err?.response?.data?.message || 'Cliente não encontrado' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // keep compatibility: onSubmit for plain forms
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const cnpjInput = form.elements.namedItem('cnpj') as HTMLInputElement | null;
    const cnpj = (cnpjInput?.value || '').replace(/\D/g, '');
    return await search(cnpj);
  };

  return { visible, open, close, onSubmit, loading, client, search };
}
