import React from 'react';
import { Card, Button, Space, Select } from 'antd';
import { PeriodFilterProps, MONTH_OPTIONS, QUARTER_OPTIONS } from './types';
import styles from './styles.module.css';

const { Option } = Select;

export function PeriodFilter({
  periodType,
  selectedMonth,
  selectedQuarter,
  onPeriodChange,
  onMonthChange,
  onQuarterChange,
}: PeriodFilterProps) {
  return (
    <Card className={styles.filterCard}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div className={styles.filterTitle}>
          Filtrar por Período
        </div>
        
        <Space wrap>
          <Button 
            type={periodType === 'all' ? 'primary' : 'default'}
            onClick={() => onPeriodChange('all')}
          >
            Todos os Períodos
          </Button>
          <Button 
            type={periodType === 'monthly' ? 'primary' : 'default'}
            onClick={() => onPeriodChange('monthly')}
          >
            Relatório Mensal
          </Button>
          <Button 
            type={periodType === 'quarterly' ? 'primary' : 'default'}
            onClick={() => onPeriodChange('quarterly')}
          >
            Relatório Trimestral
          </Button>
        </Space>

        {periodType === 'monthly' && (
          <div className={styles.selectContainer}>
            <Select
              placeholder="Selecione o mês"
              style={{ width: '200px' }}
              value={selectedMonth || undefined}
              onChange={onMonthChange}
            >
              {MONTH_OPTIONS.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {periodType === 'quarterly' && (
          <div className={styles.selectContainer}>
            <Select
              placeholder="Selecione o trimestre"
              style={{ width: '200px' }}
              value={selectedQuarter || undefined}
              onChange={onQuarterChange}
            >
              {QUARTER_OPTIONS.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </Space>
    </Card>
  );
}
