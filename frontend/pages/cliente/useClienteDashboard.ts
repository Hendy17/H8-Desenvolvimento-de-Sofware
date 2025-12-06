import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { notification } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { DashboardData } from './types';

export function useClienteDashboard() {
  const router = useRouter();
  const { cnpj } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!cnpj) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${apiUrl}/clients/${cnpj}/expenses/summary`, {
          withCredentials: true,
        });
        setData(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cnpj]);

  const handleVoltar = () => {
    router.push('/');
  };

  const handleUploadSubmit = async () => {
    if (!fileList || fileList.length === 0) {
      notification.warning({ message: 'Selecione ao menos um arquivo' });
      return;
    }
    setUploading(true);
    try {
      let totalProcessed = 0;
      let totalExpenses = 0;
      for (const f of fileList) {
        const form = new FormData();
        // @ts-ignore
        form.append('file', f.originFileObj);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.post(`${apiUrl}/clients/attachments/${cnpj}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        
        if (response.data.processed) {
          totalProcessed++;
          totalExpenses += response.data.expensesAdded || 0;
        }
      }

      if (totalProcessed > 0) {
        notification.success({
          message: 'Planilhas processadas com sucesso!',
          description: `${totalExpenses} despesa(s) adicionada(s). Recarregue a página para ver os dados atualizados.`,
          duration: 6,
        });
        // Recarregar dados após 1 segundo
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        notification.success({ message: 'Arquivos enviados com sucesso!' });
      }

      setUploadOpen(false);
      setFileList([]);
    } catch (err: any) {
      notification.error({ message: err?.response?.data?.message || 'Erro ao enviar arquivos' });
    } finally {
      setUploading(false);
    }
  };

  return {
    loading,
    data,
    cnpj,
    handleVoltar,
    uploadOpen,
    setUploadOpen,
    fileList,
    setFileList,
    uploading,
    handleUploadSubmit,
  };
}
