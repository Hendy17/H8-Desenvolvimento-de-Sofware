export interface ExpenseRecord {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface UploadResponse {
  processed: boolean;
  expensesAdded?: number;
  message?: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
}

export interface DashboardData {
  expenses: Array<{
    category: string;
    total: string;
  }>;
}