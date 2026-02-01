import type { PeriodType } from '../../types/cliente/types';

export interface ClienteDashboardProps {
  loading: boolean;
  data: any;
  cnpj: string | string[];
  handleVoltar: () => void;
  uploadOpen: boolean;
  setUploadOpen: (open: boolean) => void;
  fileList: any[];
  setFileList: (files: any[]) => void;
  uploading: boolean;
  handleUploadSubmit: () => void;
  periodType: PeriodType;
  selectedMonth: string;
  selectedQuarter: string;
  handlePeriodChange: (period: PeriodType) => void;
  handleMonthChange: (month: string) => void;
  handleQuarterChange: (quarter: string) => void;
  allExpenses: any[];
  fetchAllExpenses: () => void;
  chartData: ChartDataItem[];
  totalExpenses: number;
  totalEntradas: number;
  totalSaidas: number;
  saldoLiquido: number;
  biggestCategory: ChartDataItem | null;
}

export interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: any;
}
