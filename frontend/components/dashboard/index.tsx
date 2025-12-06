import React from 'react';
import { Layout, Button, Typography } from 'antd';
import useDashboard from './useDashboard';
import HeaderRight from '../header-right';
import styles from './styles.module.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function DashboardComponent() {
  const { user, logout } = useDashboard();

  return (
    <>
      <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.brand}>H8 Desenvolvimento de software</div>
        <Button onClick={logout}>Sair</Button>
      </Header>
      <Content className={styles.content}>
        <div className={styles.centerBox}>
          <div>
            <Title level={2} className={styles.welcome}>Bem-vindo</Title>
            {user?.email && <div style={{ textAlign: 'center', marginTop: 8 }}>{user.email}</div>}
          </div>
        </div>
      </Content>
      </Layout>
      <HeaderRight />
    </>
  );
}
