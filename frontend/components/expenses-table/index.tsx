import { Table, Button, TextInput, NumberInput, Group, ActionIcon, Modal, Stack, Paper, Text } from '@mantine/core';
import { IconEdit, IconTrash, IconCheck, IconX, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import styles from './styles.module.css';
import { useExpensesTable } from './useExpensesTable';
import { ExpensesTableProps } from './types';
import type { ExpenseRecord } from '@shared/types';

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
    toggleType,
  } = useExpensesTable(onExpensesChange);

  const handleCategoryChange = (value: string) => {
    setEditingData({ ...editingData, category: value });
  };

  const handleDescriptionChange = (value: string) => {
    setEditingData({ ...editingData, description: value });
  };

  const handleAmountChange = (value: string | number) => {
    setEditingData({ ...editingData, amount: Number(value) || 0 });
  };

  const handleDateChange = (value: Date | null) => {
    setEditingData({ ...editingData, date: value ? value.toISOString().split('T')[0] : '' });
  };

  const handleDateInputChange = (value: string) => {
    setEditingData({ ...editingData, date: value });
  };

  return (
    <Paper shadow="xs" p="md">
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: '18%' }}>Categoria</Table.Th>
            <Table.Th style={{ width: '30%' }}>Descrição</Table.Th>
            <Table.Th style={{ width: '13%' }}>Valor (R$)</Table.Th>
            <Table.Th style={{ width: '12%' }}>Tipo</Table.Th>
            <Table.Th style={{ width: '12%' }}>Data</Table.Th>
            <Table.Th style={{ width: '15%' }}>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {expenses.map((record) => (
            <Table.Tr key={record.id}>
              <Table.Td>
                {isEditing(record) ? (
                  <TextInput
                    value={editingData.category || ''}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    placeholder="Categoria"
                    size="sm"
                  />
                ) : (
                  record.category
                )}
              </Table.Td>
              <Table.Td>
                {isEditing(record) ? (
                  <TextInput
                    value={editingData.description || ''}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder="Descrição"
                    size="sm"
                  />
                ) : (
                  record.description
                )}
              </Table.Td>
              <Table.Td>
                {isEditing(record) ? (
                  <NumberInput
                    value={editingData.amount || 0}
                    onChange={handleAmountChange}
                    decimalScale={2}
                    placeholder="0.00"
                    size="sm"
                    min={0}
                  />
                ) : (
                  <Text fw={500}>
                    R$ {parseFloat(String(record.amount)).toFixed(2)}
                  </Text>
                )}
              </Table.Td>
              <Table.Td>
                {isEditing(record) ? (
                  <ActionIcon
                    variant="light"
                    color={editingData.type === 'ENTRADA' ? 'green' : 'red'}
                    onClick={toggleType}
                    size="lg"
                    style={{ cursor: 'pointer' }}
                  >
                    {editingData.type === 'ENTRADA' ? (
                      <IconTrendingUp size={18} />
                    ) : (
                      <IconTrendingDown size={18} />
                    )}
                  </ActionIcon>
                ) : (
                  <Text
                    size="sm"
                    fw={500}
                    c={record.type === 'ENTRADA' ? 'green' : 'red'}
                  >
                    {record.type === 'ENTRADA' ? '📈 Entrada' : '📉 Saída'}
                  </Text>
                )}
              </Table.Td>
              <Table.Td>
                {isEditing(record) ? (
                  <TextInput
                    type="date"
                    value={editingData.date || ''}
                    onChange={(e) => handleDateInputChange(e.target.value)}
                    size="sm"
                  />
                ) : (
                  dayjs(record.date).format('DD/MM/YYYY')
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {isEditing(record) ? (
                    <>
                      <ActionIcon
                        variant="filled"
                        color="green"
                        onClick={() => save(record.id)}
                        loading={loading}
                        size="sm"
                      >
                        <IconCheck size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="gray"
                        onClick={cancel}
                        size="sm"
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    </>
                  ) : (
                    <>
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => edit(record)}
                        size="sm"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDelete(record.id)}
                        size="sm"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
