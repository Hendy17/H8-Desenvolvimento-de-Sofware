import type { ExpenseRecord } from '@shared/types';

export interface ExpensesTableProps {
  expenses: ExpenseRecord[];
  onExpensesChange: () => void;
}