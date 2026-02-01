import { useState } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import dayjs from 'dayjs';
import type { ExpenseRecord } from '../../types/shared';

export function useExpensesTable(onExpensesChange: () => void) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const form = useForm({
    initialValues: {
      category: '',
      description: '',
      amount: 0,
      date: new Date()
    }
  });
  const [loading, setLoading] = useState(false);
  const [editingData, setEditingData] = useState<Partial<ExpenseRecord>>({});

  const isEditing = (record: ExpenseRecord) => record.id === editingKey;

  const toggleType = () => {
    setEditingData({ 
      ...editingData, 
      type: editingData.type === 'ENTRADA' ? 'SAIDA' : 'ENTRADA' 
    });
  };

  const edit = (record: ExpenseRecord) => {
    setEditingKey(record.id);
    setEditingData({ ...record });
    form.setValues({
      category: record.category,
      description: record.description,
      amount: record.amount,
      date: new Date(record.date),
    });
  };

  const cancel = () => {
    setEditingKey(null);
    setEditingData({});
  };

  const save = async (id: string) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const response = await axios.put(
        `${apiUrl}/clients/expenses/${id}`,
        {
          category: editingData.category,
          description: editingData.description,
          amount: editingData.amount,
          type: editingData.type,
          date: editingData.date ? new Date(editingData.date).toISOString().split('T')[0] : undefined,
        },
        { withCredentials: true }
      );

      notifications.show({ 
        title: 'Sucesso', 
        message: 'Despesa atualizada com sucesso!', 
        color: 'green' 
      });
      setEditingKey(null);
      setEditingData({});
      onExpensesChange();
    } catch (error: any) {
      notifications.show({
        title: 'Erro ao atualizar despesa',
        message: error?.response?.data?.message || 'Tente novamente',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      await axios.delete(
        `${apiUrl}/clients/expenses/${id}`,
        { withCredentials: true }
      );

      notifications.show({ 
        title: 'Sucesso', 
        message: 'Despesa deletada com sucesso!', 
        color: 'green' 
      });
      onExpensesChange();
    } catch (error: any) {
      notifications.show({
        title: 'Erro ao deletar despesa',
        message: error?.response?.data?.message || 'Tente novamente',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    editingData,
    loading,
    isEditing,
    edit,
    cancel,
    save,
    handleDelete,
    setEditingData,
    toggleType,
  };
}
