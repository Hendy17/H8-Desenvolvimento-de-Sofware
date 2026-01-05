import type { ExpenseRecord } from '../../hooks/cliente/useClienteDashboard';

export interface ExpensesTableProps {
  expenses: ExpenseRecord[];
  onExpensesChange: () => void;
}