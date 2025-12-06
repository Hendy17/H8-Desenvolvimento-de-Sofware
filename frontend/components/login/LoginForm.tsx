import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import useLoginForm from './useLoginForm';
import styles from './styles.module.css';

const { Title } = Typography;

export default function LoginForm() {
  const { loading, onFinish } = useLoginForm();

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Entrar</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="E-mail" rules={[{ required: true, message: 'Informe o e-mail' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Senha" rules={[{ required: true, message: 'Informe a senha' }]}> 
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>Entrar</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
