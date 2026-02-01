import React, { useState } from 'react';
import { AppShell, Button, Title, Text, Container, Card, Group, Stack, Modal, TextInput, Grid } from '@mantine/core';
import { IconSearch, IconUserPlus, IconChartPie, IconBuilding } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import useDashboard from './useDashboard';
import styles from './styles.module.css';

export default function DashboardComponent() {
  const { user, logout } = useDashboard();
  const router = useRouter();
  const [accessClientModalOpen, setAccessClientModalOpen] = useState(false);
  const [registerClientModalOpen, setRegisterClientModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Formulário para acessar cliente
  const accessForm = useForm({
    initialValues: {
      cnpj: '',
    },
    validate: {
      cnpj: (value) => {
        const cleanCnpj = value.replace(/\D/g, '');
        if (cleanCnpj.length !== 14) return 'CNPJ deve ter 14 dígitos';
        return null;
      }
    },
  });

  // Formulário para cadastrar cliente
  const registerForm = useForm({
    initialValues: {
      name: '',
      cnpj: '',
      address: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : null),
      cnpj: (value) => {
        const cleanCnpj = value.replace(/\D/g, '');
        if (cleanCnpj.length !== 14) return 'CNPJ deve ter 14 dígitos';
        return null;
      }
    },
  });

  const handleAccessClient = async (values: typeof accessForm.values) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${apiUrl}/clients/search?cnpj=${values.cnpj}`, {
        credentials: 'include',
        headers
      });

      if (response.ok) {
        const client = await response.json();
        if (client) {
          notifications.show({
            title: 'Cliente encontrado!',
            message: `Acessando dados de ${client.name}`,
            color: 'green'
          });
          // Redirecionar para a página do cliente
          router.push(`/cliente?cnpj=${values.cnpj}`);
        } else {
          notifications.show({
            title: 'Cliente não encontrado',
            message: 'Verifique o CNPJ ou cadastre o cliente primeiro',
            color: 'yellow'
          });
        }
      } else {
        notifications.show({
          title: 'Erro',
          message: 'Erro ao buscar cliente',
          color: 'red'
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao buscar cliente',
        color: 'red'
      });
    } finally {
      setLoading(false);
      setAccessClientModalOpen(false);
      accessForm.reset();
    }
  };

  const handleRegisterClient = async (values: typeof registerForm.values) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      const headers = { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const response = await fetch(`${apiUrl}/clients`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(values)
      });

      if (response.ok) {
        const client = await response.json();
        notifications.show({
          title: 'Cliente cadastrado!',
          message: `${client.name} foi cadastrado com sucesso`,
          color: 'green'
        });
        setRegisterClientModalOpen(false);
        registerForm.reset();
      } else {
        const error = await response.json();
        notifications.show({
          title: 'Erro ao cadastrar',
          message: error.message || 'Erro desconhecido',
          color: 'red'
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao cadastrar cliente',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCNPJ = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length <= 14) {
      return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        padding="md"
        className={styles.layout}
      >
        <AppShell.Header className={styles.header}>
          <div className={styles.brand}>H8 Desenvolvimento de Software</div>
          <Button onClick={logout}>Sair</Button>
        </AppShell.Header>
        
        <AppShell.Main className={styles.content}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: 'calc(100vh - 60px)',
            padding: '2rem' 
          }}>
            <Stack gap="xl" align="center" style={{ width: '100%', maxWidth: '700px' }}>
              <Title order={2} className={styles.welcome} style={{ textAlign: 'center', marginBottom: '2rem' }}>
                Olá! Pronto para transformar dados em estratégia hoje?
              </Title>

              <Grid justify="center" style={{ width: '100%' }}>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card shadow="sm" padding="xl" radius="md" withBorder style={{ height: '100%' }}>
                    <Stack align="center" gap="md" style={{ height: '100%' }}>
                      <IconSearch size={64} color="#0088FE" />
                      <Title order={3}>Acessar Cliente</Title>
                      <Text size="sm" c="dimmed" ta="center">
                        Busque um cliente existente por CNPJ para acessar seus dados, relatórios e fazer upload de planilhas
                      </Text>
                      <Button 
                        fullWidth 
                        mt="md" 
                        size="lg"
                        onClick={() => setAccessClientModalOpen(true)}
                        leftSection={<IconChartPie size={20} />}
                      >
                        Buscar Cliente
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card shadow="sm" padding="xl" radius="md" withBorder style={{ height: '100%' }}>
                    <Stack align="center" gap="md" style={{ height: '100%' }}>
                      <IconUserPlus size={64} color="#00C49F" />
                      <Title order={3}>Cadastrar Cliente</Title>
                      <Text size="sm" c="dimmed" ta="center">
                        Registre um novo cliente no sistema com nome, CNPJ e endereço
                      </Text>
                      <Button 
                        fullWidth 
                        mt="md" 
                        size="lg"
                        variant="outline"
                        onClick={() => setRegisterClientModalOpen(true)}
                        leftSection={<IconBuilding size={20} />}
                      >
                        Novo Cliente
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            </Stack>
          </div>
        </AppShell.Main>
      </AppShell>

      {/* Modal para acessar cliente */}
      <Modal
        opened={accessClientModalOpen}
        onClose={() => {
          setAccessClientModalOpen(false);
          accessForm.reset();
        }}
        title="Acessar Cliente"
        size="md"
      >
        <form onSubmit={accessForm.onSubmit(handleAccessClient)}>
          <Stack gap="md">
            <TextInput
              label="CNPJ do Cliente"
              placeholder="00.000.000/0000-00"
              {...accessForm.getInputProps('cnpj')}
              onChange={(e) => {
                const formatted = formatCNPJ(e.target.value);
                accessForm.setFieldValue('cnpj', formatted);
              }}
              maxLength={18}
              required
            />
            
            <Group justify="flex-end" mt="md">
              <Button 
                variant="outline" 
                onClick={() => {
                  setAccessClientModalOpen(false);
                  accessForm.reset();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                Buscar Cliente
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal para cadastrar cliente */}
      <Modal
        opened={registerClientModalOpen}
        onClose={() => {
          setRegisterClientModalOpen(false);
          registerForm.reset();
        }}
        title="Cadastrar Novo Cliente"
        size="md"
      >
        <form onSubmit={registerForm.onSubmit(handleRegisterClient)}>
          <Stack gap="md">
            <TextInput
              label="Nome da Empresa"
              placeholder="Razão Social"
              {...registerForm.getInputProps('name')}
              required
            />
            
            <TextInput
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              {...registerForm.getInputProps('cnpj')}
              onChange={(e) => {
                const formatted = formatCNPJ(e.target.value);
                registerForm.setFieldValue('cnpj', formatted);
              }}
              maxLength={18}
              required
            />
            
            <TextInput
              label="Endereço (Opcional)"
              placeholder="Endereço completo"
              {...registerForm.getInputProps('address')}
            />
            
            <Group justify="flex-end" mt="md">
              <Button 
                variant="outline" 
                onClick={() => {
                  setRegisterClientModalOpen(false);
                  registerForm.reset();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                Cadastrar
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
