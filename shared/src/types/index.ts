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
  type: 'ENTRADA' | 'SAIDA'; // Novo campo
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

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginResponse {
  message: string;
  access_token: string;
}

export type PeriodType = 'all' | 'month' | 'quarter' | 'year';