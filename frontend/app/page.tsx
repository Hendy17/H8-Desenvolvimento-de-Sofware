'use client'
import { useState } from 'react'
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Center,
  Box,
  Stack,
  Group,
  ThemeIcon,
  BackgroundImage,
  Modal,
  Anchor,
  Divider
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconCalculator, IconMail, IconLock, IconUserPlus } from '@tabler/icons-react'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false)
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => {
        // Permitir formatos flexíveis em desenvolvimento: admin, admin@user.com, etc.
        if (value.length < 1) return 'Email é obrigatório'
        if (value.includes('@') && !/^\S+@\S+$/.test(value)) return 'Formato de email inválido'
        return null
      },
      password: (value) => (value.length < 1 ? 'Senha é obrigatória' : null),
    },
  })

  const registerForm = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      password: (value) => (value.length < 6 ? 'Senha deve ter pelo menos 6 caracteres' : null),
      confirmPassword: (value, values) => (value !== values.password ? 'Senhas não coincidem' : null)
    }
  })

  const forgotPasswordForm = useForm({
    initialValues: {
      email: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido')
    }
  })

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Importante para cookies
        body: JSON.stringify(values)
      })
      
      if (response.ok) {
        const data = await response.json()
        // Armazenar token se retornado (produção cross-domain)
        if (data?.access_token) {
          localStorage.setItem('token', data.access_token)
        }
        notifications.show({
          title: 'Login realizado com sucesso!',
          message: 'Redirecionando para o dashboard...',
          color: 'green'
        })
        // Usar router.push em vez de window.location para melhor controle
        window.location.href = '/dashboard'
      } else {
        const errorData = await response.json()
        notifications.show({
          title: 'Erro de autenticação',
          message: errorData?.message || 'Email ou senha incorretos',
          color: 'red'
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Erro de conexão',
        message: 'Não foi possível conectar ao servidor',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (values: typeof registerForm.values) => {
    setRegisterLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      })
      
      if (response.ok) {
        notifications.show({
          title: 'Cadastro realizado com sucesso!',
          message: 'Agora você pode fazer login',
          color: 'green'
        })
        registerForm.reset()
        setRegisterModalOpen(false)
      } else {
        const errorData = await response.json()
        notifications.show({
          title: 'Erro no cadastro',
          message: errorData.message || 'Não foi possível criar a conta',
          color: 'red'
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Erro de conexão',
        message: 'Não foi possível conectar ao servidor',
        color: 'red'
      })
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleForgotPassword = async (values: { email: string }) => {
    setForgotPasswordLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      
      if (response.ok) {
        notifications.show({
          title: 'Email enviado com sucesso!',
          message: 'Verifique sua caixa de entrada com suas credenciais',
          color: 'green'
        })
        forgotPasswordForm.reset()
        setForgotPasswordModalOpen(false)
      } else {
        const errorData = await response.json()
        notifications.show({
          title: 'Erro ao enviar email',
          message: errorData.message || 'Email não encontrado',
          color: 'red'
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Erro de conexão',
        message: 'Não foi possível conectar ao servidor',
        color: 'red'
      })
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Container size={420}>
        <Paper 
          withBorder 
          shadow="xl" 
          p={40} 
          radius="lg"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Center mb={30}>
            <Group gap={15}>
              <ThemeIcon
                size={50}
                radius="xl"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
              >
                <IconCalculator size={28} />
              </ThemeIcon>
              <Box>
                <Title order={2} size="h1" fw={700} c="dark.8">
                  Flow8
                </Title>
                <Text size="sm" c="dimmed" fw={500}>
                  Sistema de Gestão Contábil
                </Text>
              </Box>
            </Group>
          </Center>

          <Text c="dimmed" size="sm" ta="center" mb={30}>
            Faça login para acessar sua conta empresarial
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap={20}>
              <TextInput
                leftSection={<IconMail size={18} />}
                label="Email"
                placeholder="seu@email.com"
                size="md"
                radius="md"
                {...form.getInputProps('email')}
                styles={{
                  input: {
                    borderColor: '#e9ecef',
                    '&:focus': {
                      borderColor: '#4c6ef5',
                      boxShadow: '0 0 0 2px rgba(76, 110, 245, 0.1)'
                    }
                  }
                }}
              />

              <PasswordInput
                leftSection={<IconLock size={18} />}
                label="Senha"
                placeholder="Sua senha"
                size="md"
                radius="md"
                {...form.getInputProps('password')}
                styles={{
                  input: {
                    borderColor: '#e9ecef',
                    '&:focus': {
                      borderColor: '#4c6ef5',
                      boxShadow: '0 0 0 2px rgba(76, 110, 245, 0.1)'
                    }
                  }
                }}
              />

              <Button
                type="submit"
                size="md"
                radius="md"
                loading={loading}
                fullWidth
                mt={20}
                gradient={{ from: 'blue', to: 'cyan' }}
                variant="gradient"
                style={{
                  height: '48px',
                  fontWeight: 600,
                  fontSize: '16px'
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </Stack>
          </form>

          <Divider my={30} labelPosition="center" label="ou" />
          
          <Button
            variant="outline"
            size="md"
            radius="md"
            fullWidth
            leftSection={<IconUserPlus size={18} />}
            onClick={() => setRegisterModalOpen(true)}
            style={{
              height: '48px',
              fontWeight: 500,
              fontSize: '16px'
            }}
          >
            Criar Nova Conta
          </Button>

          <Group justify="center" mt={20}>
            <Anchor
              component="button"
              type="button"
              c="blue"
              size="sm"
              onClick={() => setForgotPasswordModalOpen(true)}
            >
              Esqueci minha senha
            </Anchor>
          </Group>

          <Text ta="center" mt={20} size="sm" c="dimmed">
            Acesso seguro com criptografia de ponta
          </Text>
        </Paper>

        {/* Modal de Registro */}
        <Modal 
          opened={registerModalOpen} 
          onClose={() => {
            setRegisterModalOpen(false)
            registerForm.reset()
          }} 
          title="Criar Nova Conta"
          size="md"
          centered
        >
          <form onSubmit={registerForm.onSubmit(handleRegister)}>
            <Stack gap={20}>
              <TextInput
                label="Nome Completo"
                placeholder="Digite seu nome"
                size="md"
                radius="md"
                {...registerForm.getInputProps('name')}
              />
              
              <TextInput
                leftSection={<IconMail size={18} />}
                label="Email"
                placeholder="seu@email.com"
                size="md"
                radius="md"
                {...registerForm.getInputProps('email')}
              />
              
              <PasswordInput
                leftSection={<IconLock size={18} />}
                label="Senha"
                placeholder="Mínimo 6 caracteres"
                size="md"
                radius="md"
                {...registerForm.getInputProps('password')}
              />
              
              <PasswordInput
                leftSection={<IconLock size={18} />}
                label="Confirmar Senha"
                placeholder="Confirme sua senha"
                size="md"
                radius="md"
                {...registerForm.getInputProps('confirmPassword')}
              />
              
              <Group justify="flex-end" mt={20}>
                <Button 
                  variant="light" 
                  onClick={() => {
                    setRegisterModalOpen(false)
                    registerForm.reset()
                  }}
                  disabled={registerLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  loading={registerLoading}
                  gradient={{ from: 'blue', to: 'cyan' }}
                  variant="gradient"
                >
                  Criar Conta
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Modal Esqueci Minha Senha */}
        <Modal 
          opened={forgotPasswordModalOpen} 
          onClose={() => {
            setForgotPasswordModalOpen(false)
            forgotPasswordForm.reset()
          }} 
          title="Recuperar Credenciais"
          size="md"
          centered
        >
          <Text size="sm" c="dimmed" mb={20}>
            Digite seu email e enviaremos suas credenciais de acesso
          </Text>
          
          <form onSubmit={forgotPasswordForm.onSubmit(handleForgotPassword)}>
            <Stack gap={20}>
              <TextInput
                leftSection={<IconMail size={18} />}
                label="Email"
                placeholder="seu@email.com"
                size="md"
                radius="md"
                {...forgotPasswordForm.getInputProps('email')}
              />
              
              <Group justify="flex-end" mt={20}>
                <Button 
                  variant="light" 
                  onClick={() => {
                    setForgotPasswordModalOpen(false)
                    forgotPasswordForm.reset()
                  }}
                  disabled={forgotPasswordLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  loading={forgotPasswordLoading}
                  gradient={{ from: 'blue', to: 'cyan' }}
                  variant="gradient"
                >
                  Enviar Credenciais
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
    </Box>
  )
}