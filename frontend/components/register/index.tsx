import React from 'react';
import { Layout, Form, Input, Button, Typography, Spin } from 'antd';
import useRegister from './useRegister';
import styles from './styles.module.css';
import type { RegisterValues } from './types';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function RegisterComponent() {
  const { loading, autoLogging, onFinish } = useRegister();

  return (
    <Layout className={styles.root}>
      <Header className={styles.header}>
        <div className={styles.brand}>H8 Desenvolvimento de software</div>
      </Header>
      <Content className={styles.content}>
        <div className={styles.card}>
          {autoLogging && (
            <div className={styles.overlay}>
              <Spin tip="Autenticando..." />
            </div>
          )}
          <Title level={3} style={{ textAlign: 'center' }}>Criar conta</Title>
          <Form<RegisterValues> layout="vertical" onFinish={onFinish}>
            <Form.Item name="email" label="Usuário" rules={[{ required: true, message: 'Informe o usuário' }]}> 
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Senha" rules={[{ required: true, message: 'Informe a senha' }]}> 
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>Criar</Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}
