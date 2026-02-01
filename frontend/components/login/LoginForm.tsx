import React from 'react';
import { Paper, TextInput, PasswordInput, Button, Title, Stack } from '@mantine/core';
import useLoginForm from './useLoginForm';
import styles from './styles.module.css';

export default function LoginForm() {
  const { loading, onFinish } = useLoginForm();

  return (
    <div className={styles.wrapper}>
      <Paper className={styles.card} shadow="md" p="lg">
        <Title order={3} style={{ textAlign: 'center', marginBottom: 24 }}>Entrar</Title>
        <Stack gap="md">
          <TextInput
            label="E-mail"
            placeholder="Digite seu e-mail"
            required
          />
          <PasswordInput
            label="Senha"
            placeholder="Digite sua senha"
            required
          />
          <Button 
            type="submit"
            fullWidth
            loading={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
