import React from 'react';
import { Card, Button, Stack, Group, Select } from '@mantine/core';
import { PeriodFilterProps, MONTH_OPTIONS, QUARTER_OPTIONS } from './types';
import styles from './styles.module.css';

export function PeriodFilter({
  periodType,
  selectedMonth,
  selectedQuarter,
  onPeriodChange,
  onMonthChange,
  onQuarterChange,
}: PeriodFilterProps) {
  return (
    <Card shadow="xs" padding="md" className={styles.filterCard}>
      <Stack gap="md">
        <div className={styles.filterTitle}>
          Filtrar por Período
        </div>
        
        <Group wrap="wrap">
          <Button 
            variant={periodType === 'all' ? 'filled' : 'outline'}
            onClick={() => onPeriodChange('all')}
          >
            Todos os Períodos
          </Button>
          <Button 
            variant={periodType === 'monthly' ? 'filled' : 'outline'}
            onClick={() => onPeriodChange('monthly')}
          >
            Relatório Mensal
          </Button>
          <Button 
            variant={periodType === 'quarterly' ? 'filled' : 'outline'}
            onClick={() => onPeriodChange('quarterly')}
          >
            Relatório Trimestral
          </Button>
        </Group>

        {periodType === 'monthly' && (
          <div className={styles.selectContainer}>
            <Select
              placeholder="Selecione o mês"
              w={200}
              value={selectedMonth || null}
              onChange={onMonthChange}
              data={MONTH_OPTIONS}
            />
          </div>
        )}

        {periodType === 'quarterly' && (
          <div className={styles.selectContainer}>
            <Select
              placeholder="Selecione o trimestre"
              w={200}
              value={selectedQuarter || null}
              onChange={onQuarterChange}
              data={QUARTER_OPTIONS}
            />
          </div>
        )}
      </Stack>
    </Card>
  );
}
