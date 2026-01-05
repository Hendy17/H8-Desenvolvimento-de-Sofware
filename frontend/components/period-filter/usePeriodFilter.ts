import { useState, useCallback } from 'react';
import { PeriodType } from '../../types/cliente/types';

export function usePeriodFilter() {
  const [periodType, setPeriodType] = useState<PeriodType>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('');

  const handlePeriodChange = useCallback((period: PeriodType) => {
    setPeriodType(period);
    setSelectedMonth('');
    setSelectedQuarter('');
  }, []);

  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonth(month);
  }, []);

  const handleQuarterChange = useCallback((quarter: string) => {
    setSelectedQuarter(quarter);
  }, []);

  return {
    periodType,
    selectedMonth,
    selectedQuarter,
    handlePeriodChange,
    handleMonthChange,
    handleQuarterChange,
  };
}
