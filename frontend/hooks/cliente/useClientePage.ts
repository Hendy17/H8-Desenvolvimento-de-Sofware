import { useClienteDashboard } from '../../hooks/cliente/useClienteDashboard';

export function useClientePage() {
  const { 
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
    periodType,
    selectedMonth,
    selectedQuarter,
    handlePeriodChange,
    handleMonthChange,
    handleQuarterChange,
    allExpenses,
    fetchAllExpenses,
  } = useClienteDashboard();

  const chartData = data?.expenses?.map((exp: any) => ({
    name: exp.category,
    value: parseFloat(exp.total),
  })) || [];

  const totalExpenses = chartData.reduce((sum: number, item: any) => sum + item.value, 0);
  const biggestCategory = chartData.length > 0 ? chartData[0] : null;

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
    periodType,
    selectedMonth,
    selectedQuarter,
    handlePeriodChange,
    handleMonthChange,
    handleQuarterChange,
    allExpenses,
    fetchAllExpenses,
    chartData,
    totalExpenses,
    biggestCategory,
  };
}
