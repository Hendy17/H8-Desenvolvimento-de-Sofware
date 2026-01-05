import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { notification } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { DashboardData } from '../../types/cliente/types';
import { usePeriodFilter } from '../../components/period-filter/usePeriodFilter';

export interface ExpenseRecord {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export function useClienteDashboard() {
  const router = useRouter();
  const { cnpj } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [allExpenses, setAllExpenses] = useState<ExpenseRecord[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    periodType,
    selectedMonth,
    selectedQuarter,
    handlePeriodChange,
    handleMonthChange,
    handleQuarterChange,
  } = usePeriodFilter();

  const fetchExpensesData = async (period = periodType, month = selectedMonth, quarter = selectedQuarter) => {
    if (!cnpj) return;

    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const normalizedCnpj = (cnpj as string)?.replace(/\D/g, '') || '';
      
      let url = `${apiUrl}/clients/${normalizedCnpj}/expenses/summary`;
      
      // Adicionar parâmetros de filtro se necessário
      if (period === 'monthly' && month) {
        url += `?period=monthly&month=${month}`;
      } else if (period === 'quarterly' && quarter) {
        url += `?period=quarterly&quarter=${quarter}`;
      }
      
      console.log('🔍 Buscando dados de:', url);
      const response = await axios.get(url, {
        withCredentials: true,
      });
      setData(response.data);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      notification.error({ message: 'Erro ao carregar dados de despesas' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllExpenses = async () => {
    if (!cnpj) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const normalizedCnpj = (cnpj as string)?.replace(/\D/g, '') || '';
      
      const response = await axios.get(
        `${apiUrl}/clients/${normalizedCnpj}/expenses`,
        { withCredentials: true }
      );
      setAllExpenses(response.data.expenses || []);
    } catch (error) {
      console.error('❌ Erro ao carregar despesas:', error);
    }
  };

  useEffect(() => {
    if (!cnpj) return;

    fetchExpensesData(periodType, selectedMonth, selectedQuarter);
    fetchAllExpenses();

  }, [cnpj, periodType, selectedMonth, selectedQuarter]);

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
      // Normalizar CNPJ: remover tudo que não é número
      const normalizedCnpj = (cnpj as string)?.replace(/\D/g, '') || '';
      console.log('📤 Enviando para CNPJ normalizado:', normalizedCnpj);
      console.log('📤 Comprimento do CNPJ:', normalizedCnpj.length);
      for (const f of fileList) {
        const form = new FormData();
        // @ts-ignore
        form.append('file', f.originFileObj);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.post(`${apiUrl}/clients/attachments/${normalizedCnpj}`, form, {
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
          description: `${totalExpenses} despesa(s) adicionada(s). Atualizando dados...`,
          duration: 6,
        });
        // Aguardar 2 segundos e recarregar os dados sem recarregar a página
        setTimeout(async () => {
          try {
            const normalizedCnpj = (cnpj as string)?.replace(/\D/g, '') || '';
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/clients/${normalizedCnpj}/expenses/summary`,
              { withCredentials: true }
            );
            setData(response.data);
          } catch (error) {
            console.error('Erro ao recarregar dados:', error);
          }
        }, 2000);
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
    allExpenses,
    cnpj,
    handleVoltar,
    uploadOpen,
    setUploadOpen,
    fileList,
    setFileList,
    uploading,
    handleUploadSubmit,
    periodType,
    selectedMonth,
    selectedQuarter,
    handlePeriodChange,
    handleMonthChange,
    handleQuarterChange,
    fetchAllExpenses,
  };
}
