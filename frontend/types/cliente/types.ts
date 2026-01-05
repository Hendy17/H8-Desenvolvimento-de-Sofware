export interface ExpenseSummary {
  category: string;
  total: string;
}

export interface ClientData {
  id: string;
  name: string;
  cnpj: string;
}

export interface DashboardData {
  client: ClientData;
  expenses: ExpenseSummary[];
}

export type PeriodType = 'all' | 'monthly' | 'quarterly';
