import { ClientDashboardComponent } from '../../components/cliente/ClientDashboardComponent';
import { useClientePage } from './useClientePage';

export default function ClienteDashboard() {
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
    chartData,
    totalExpenses,
    biggestCategory,
  } = useClientePage();

  return (
    <ClientDashboardComponent
      loading={loading}
      data={data}
      cnpj={cnpj}
      handleVoltar={handleVoltar}
      uploadOpen={uploadOpen}
      setUploadOpen={setUploadOpen}
      fileList={fileList}
      setFileList={setFileList}
      uploading={uploading}
      handleUploadSubmit={handleUploadSubmit}
      periodType={periodType}
      selectedMonth={selectedMonth}
      selectedQuarter={selectedQuarter}
      handlePeriodChange={handlePeriodChange}
      handleMonthChange={handleMonthChange}
      handleQuarterChange={handleQuarterChange}
      allExpenses={allExpenses}
      fetchAllExpenses={fetchAllExpenses}
      chartData={chartData}
      totalExpenses={totalExpenses}
      biggestCategory={biggestCategory}
    />
  );
}
