import { Table, Button, Input, DatePicker, InputNumber, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './styles.module.css';
import { useExpensesTable } from './useExpensesTable';
import { ExpensesTableProps } from './types';
import type { ExpenseRecord } from '../../hooks/cliente/useClienteDashboard';

export function ExpensesTable({ expenses, onExpensesChange }: ExpensesTableProps) {
  const {
    editingData,
    loading,
    isEditing,
    edit,
    cancel,
    save,
    handleDelete,
    setEditingData,
  } = useExpensesTable(onExpensesChange);

  const columns = [
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
      width: '15%',
      render: (_: string, record: ExpenseRecord) => {
        if (isEditing(record)) {
          return (
            <Input
              value={editingData.category}
              onChange={(e) => setEditingData({ ...editingData, category: e.target.value })}
              placeholder="Categoria"
            />
          );
        }
        return record.category;
      },
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      render: (_: string, record: ExpenseRecord) => {
        if (isEditing(record)) {
          return (
            <Input
              value={editingData.description}
              onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
              placeholder="Descrição"
            />
          );
        }
        return record.description;
      },
    },
    {
      title: 'Valor (R$)',
      dataIndex: 'amount',
      key: 'amount',
      width: '15%',
      align: 'right' as const,
      render: (_: number, record: ExpenseRecord) => {
        if (isEditing(record)) {
          return (
            <InputNumber
              value={editingData.amount}
              onChange={(value) => setEditingData({ ...editingData, amount: value || 0 })}
              precision={2}
              placeholder="0.00"
              style={{ width: '100%' }}
            />
          );
        }
        return `R$ ${parseFloat(String(record.amount)).toFixed(2)}`;
      },
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      render: (_: string, record: ExpenseRecord) => {
        if (isEditing(record)) {
          return (
            <DatePicker
              value={editingData.date ? dayjs(editingData.date) : null}
              onChange={(date) => setEditingData({ ...editingData, date: date ? date.format('YYYY-MM-DD') : '' })}
              format="DD/MM/YYYY"
            />
          );
        }
        return new Date(record.date).toLocaleDateString('pt-BR');
      },
    },
    {
      title: 'Ações',
      key: 'action',
      width: '15%',
      render: (_: string, record: ExpenseRecord) => {
        if (isEditing(record)) {
          return (
            <Space size="small">
              <Button
                type="primary"
                size="small"
                loading={loading}
                onClick={() => save(record.id)}
                icon={<SaveOutlined />}
              >
                Salvar
              </Button>
              <Button size="small" onClick={cancel} icon={<CloseOutlined />}>
                Cancelar
              </Button>
            </Space>
          );
        }
        return (
          <Space size="small">
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => edit(record)}
              icon={<EditOutlined />}
            >
              Editar
            </Button>
            <Popconfirm
              title="Deletar despesa"
              description="Tem certeza que deseja deletar esta despesa?"
              onConfirm={() => handleDelete(record.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button
                type="primary"
                danger
                ghost
                size="small"
                loading={loading}
                icon={<DeleteOutlined />}
              >
                Deletar
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={expenses}
      rowKey="id"
      pagination={{ pageSize: 10, showSizeChanger: true }}
      loading={loading}
      locale={{
        emptyText: 'Nenhuma despesa registrada',
      }}
      className={styles.expensesTable}
    />
  );
}
