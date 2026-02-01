// Tipos compartilhados - cópia local para Vercel build
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Client {
  id: string;
  cnpj: string;
  name: string;
  address?: string;
}

export interface ExpenseRecord {
  id: string;
  category: string;
  description: string;
  amount: number;
  type: 'ENTRADA' | 'SAIDA';
  date: string;
}

export interface UploadResponse {
  processed: boolean;
  expensesAdded?: number;
  message?: string;
}

export interface ChartDataItem {
  category: string;
  amount: number;
  percentage?: number;
  fill?: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  totalIncome: number;
  netAmount: number;
  expensesByCategory: ChartDataItem[];
  monthlyData?: ChartDataItem[];
}

export interface DashboardData {
  totalExpenses: number;
  totalIncome: number;
  netAmount: number;
  expenses?: Array<{
    category: string;
    total: string | number;
  }>;
  expensesByCategory: ChartDataItem[];
  monthlyData?: ChartDataItem[];
  recentExpenses?: ExpenseRecord[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface PeriodFilter {
  type: 'monthly' | 'quarterly';
  period: string;
}

export interface CreateClientDto {
  name: string;
  cnpj: string;
  address?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}