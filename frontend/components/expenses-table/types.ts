import type { ExpenseRecord } from '../../types/shared';

export interface ExpensesTableProps {
  expenses: ExpenseRecord[];
  onExpensesChange: () => void;
}