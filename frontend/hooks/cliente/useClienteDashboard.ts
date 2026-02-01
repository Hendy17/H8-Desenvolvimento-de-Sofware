import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { usePeriodFilter } from '../../components/period-filter/usePeriodFilter';
import { ExpenseRecord, UploadResponse, DashboardData } from '../../types/shared';

export function useClienteDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cnpj = searchParams.get('cnpj') || '';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [allExpenses, setAllExpenses] = useState<ExpenseRecord[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    periodType,
    selectedMonth,
    selectedQuarter,
    handlePeriodChange,
    handleMonthChange,
    handleQuarterChange,
  } = usePeriodFilter();

  // Processar dados para o gráfico
  const chartData = data?.expenses?.map((exp: any) => ({
    name: exp.category,
    value: parseFloat(exp.total),
  })) || [];

  // Calcular totais por tipo
  const totalEntradas = allExpenses
    .filter(expense => expense.type === 'ENTRADA')
    .reduce((sum, expense) => sum + Number(expense.amount), 0);
    
  const totalSaidas = allExpenses
    .filter(expense => expense.type === 'SAIDA')
    .reduce((sum, expense) => sum + Number(expense.amount), 0);
    
  const saldoLiquido = totalEntradas - totalSaidas;

  const totalExpenses = chartData.reduce((sum: number, item: any) => sum + item.value, 0);
  const biggestCategory = chartData.length > 0 ? chartData[0] : null;

  const fetchExpensesData = async (period = periodType, month = selectedMonth, quarter = selectedQuarter) => {
    if (!cnpj) return;

    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const normalizedCnpj = cnpj?.replace(/\D/g, '') || '';
      
      let url = `${apiUrl}/clients/${normalizedCnpj}/expenses/summary`;
      
      if (period === 'monthly' && month) {
        url += `?period=monthly&month=${month}`;
      } else if (period === 'quarterly' && quarter) {
        url += `?period=quarterly&quarter=${quarter}`;
      }
      
      console.log('🔍 Buscando dados de:', url);
      const response = await axios.get<DashboardData>(url, {
        withCredentials: true,
      });
      setData(response.data);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      notifications.show({ 
        title: 'Erro', 
        message: 'Erro ao carregar dados de despesas', 
        color: 'red' 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllExpenses = async () => {
    if (!cnpj) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const normalizedCnpj = cnpj?.replace(/\D/g, '') || '';
      
      const response = await axios.get<{ expenses: ExpenseRecord[] }>(
        `${apiUrl}/clients/${normalizedCnpj}/expenses`,
        { withCredentials: true }
      );
      const expenses = response.data.expenses || [];
      // Ordenar por data mais recente primeiro
      const sortedExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAllExpenses(sortedExpenses);
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
    router.push('/dashboard');
  };

  const handleUploadSubmit = async () => {
    if (!fileList || fileList.length === 0) {
      notifications.show({ 
        title: 'Aviso', 
        message: 'Selecione ao menos um arquivo', 
        color: 'yellow' 
      });
      return;
    }
    setUploading(true);
    try {
      let totalProcessed = 0;
      let totalExpenses = 0;
      const normalizedCnpj = cnpj?.replace(/\D/g, '') || '';
      
      for (const f of fileList) {
        const form = new FormData();
        form.append('file', f);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.post<UploadResponse>(`${apiUrl}/clients/attachments/${normalizedCnpj}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        
        if (response.data.processed) {
          totalProcessed++;
          totalExpenses += response.data.expensesAdded || 0;
        }
      }

      if (totalProcessed > 0) {
        notifications.show({
          title: 'Planilhas processadas com sucesso!',
          message: `${totalExpenses} despesa(s) adicionada(s). Atualizando dados...`,
          color: 'green'
        });
        
        setTimeout(async () => {
          try {
            const normalizedCnpj = cnpj?.replace(/\D/g, '') || '';
            const response = await axios.get<DashboardData>(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/clients/${normalizedCnpj}/expenses/summary`,
              { withCredentials: true }
            );
            setData(response.data);
          } catch (error) {
            console.error('Erro ao recarregar dados:', error);
          }
        }, 2000);
      } else {
        notifications.show({ 
          title: 'Sucesso', 
          message: 'Arquivos enviados com sucesso!', 
          color: 'green' 
        });
      }

      setUploadOpen(false);
      setFileList([]);
    } catch (err: any) {
      notifications.show({ 
        title: 'Erro', 
        message: err?.response?.data?.message || 'Erro ao enviar arquivos', 
        color: 'red' 
      });
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
    chartData,
    totalExpenses,
    totalEntradas,
    totalSaidas,
    saldoLiquido,
    biggestCategory,
  };
}
