import { PeriodType } from '../../types/cliente/types';

export interface PeriodFilterProps {
  periodType: PeriodType;
  selectedMonth: string;
  selectedQuarter: string;
  onPeriodChange: (period: PeriodType) => void;
  onMonthChange: (month: string) => void;
  onQuarterChange: (quarter: string) => void;
}

export interface PeriodOption {
  label: string;
  value: string;
}

export const getCurrentYear = () => new Date().getFullYear();

export const MONTH_OPTIONS: PeriodOption[] = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return {
    label: monthNames[i],
    value: `${getCurrentYear()}-${String(month).padStart(2, '0')}`
  };
});

export const QUARTER_OPTIONS: PeriodOption[] = [
  { label: '1º Trimestre', value: `${getCurrentYear()}-Q1` },
  { label: '2º Trimestre', value: `${getCurrentYear()}-Q2` },
  { label: '3º Trimestre', value: `${getCurrentYear()}-Q3` },
  { label: '4º Trimestre', value: `${getCurrentYear()}-Q4` },
];
