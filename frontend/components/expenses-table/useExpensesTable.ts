import { useState } from 'react';
import { Form } from 'antd';
import { notification } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import type { ExpenseRecord } from '@shared/types';

export function useExpensesTable(onExpensesChange: () => void) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingData, setEditingData] = useState<Partial<ExpenseRecord>>({});

  const isEditing = (record: ExpenseRecord) => record.id === editingKey;

  const edit = (record: ExpenseRecord) => {
    setEditingKey(record.id);
    setEditingData({ ...record });
    form.setFieldsValue({
      category: record.category,
      description: record.description,
      amount: record.amount,
      date: dayjs(record.date),
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
          date: editingData.date ? new Date(editingData.date).toISOString().split('T')[0] : undefined,
        },
        { withCredentials: true }
      );

      notification.success({ message: 'Despesa atualizada com sucesso!' });
      setEditingKey(null);
      setEditingData({});
      onExpensesChange();
    } catch (error: any) {
      notification.error({
        message: 'Erro ao atualizar despesa',
        description: error?.response?.data?.message || 'Tente novamente',
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

      notification.success({ message: 'Despesa deletada com sucesso!' });
      onExpensesChange();
    } catch (error: any) {
      notification.error({
        message: 'Erro ao deletar despesa',
        description: error?.response?.data?.message || 'Tente novamente',
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
  };
}
