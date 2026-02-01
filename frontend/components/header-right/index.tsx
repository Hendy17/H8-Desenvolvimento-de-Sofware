import React, { useState } from 'react';
import { Modal, Button, TextInput, FileInput, Group, Stack, Text, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconSettings, IconUserPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Client } from '../../types/shared';
import useHeaderRight from './useHeaderRight';
import styles from './styles.module.css';
import axios from 'axios';

// Versão simplificada temporária do HeaderRight
// TODO: Implementar formulários complexos usando useForm do Mantine
export default function HeaderRight() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const handleClienteDashboard = () => {
    router.push('/cliente');
    closeMenu();
  };

  const handleOpenCreateUser = () => {
    setMenuOpen(false);
    setCreateUserOpen(true);
  };

  const userForm = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'E-mail inválido'),
      password: (value) => (value.length >= 6 ? null : 'Senha deve ter pelo menos 6 caracteres'),
      confirmPassword: (value, values) => (value !== values.password ? 'Senhas não coincidem' : null),
      name: (value) => (value.length >= 2 ? null : 'Nome deve ter pelo menos 2 caracteres')
    }
  });

  const handleCreateUser = async (values: typeof userForm.values) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await axios.post(`${apiUrl}/auth/register`, {
        email: values.email,
        password: values.password
      });
      notifications.show({
        title: 'Sucesso',
        message: 'Usuário criado com sucesso!',
        color: 'green'
      });
      userForm.reset();
      setCreateUserOpen(false);
    } catch (error: any) {
      notifications.show({
        title: 'Erro',
        message: error?.response?.data?.message || 'Erro ao criar usuário',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button aria-label="Menu" className={styles.gearButton} onClick={openMenu}>
        <IconSettings />
      </button>
      <div className={styles.spacer} />

      {/* Menu modal com opções */}
      <Modal opened={menuOpen} onClose={closeMenu} title="Opções">
        <Stack gap="md">
          <Button 
            fullWidth 
            variant="filled" 
            onClick={handleClienteDashboard}
          >
            Dashboard do Cliente
          </Button>
          <Button 
            fullWidth 
            variant="outline" 
            leftSection={<IconUserPlus size={16} />}
            onClick={handleOpenCreateUser}
          >
            Criar Usuário
          </Button>
        </Stack>
      </Modal>

      {/* Modal de criação de usuário */}
      <Modal 
        opened={createUserOpen} 
        onClose={() => {
          setCreateUserOpen(false);
          userForm.reset();
        }} 
        title="Criar Novo Usuário"
        size="md"
      >
        <form onSubmit={userForm.onSubmit(handleCreateUser)}>
          <Stack gap="md">
            <TextInput
              label="Nome"
              placeholder="Nome completo"
              required
              {...userForm.getInputProps('name')}
            />
            <TextInput
              label="E-mail"
              placeholder="usuario@exemplo.com"
              required
              {...userForm.getInputProps('email')}
            />
            <PasswordInput
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              required
              {...userForm.getInputProps('password')}
            />
            <PasswordInput
              label="Confirmar Senha"
              placeholder="Confirme a senha"
              required
              {...userForm.getInputProps('confirmPassword')}
            />
            <Group justify="flex-end" mt="md">
              <Button 
                variant="light" 
                onClick={() => {
                  setCreateUserOpen(false);
                  userForm.reset();
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                loading={loading}
              >
                Criar Usuário
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </div>
  );
}