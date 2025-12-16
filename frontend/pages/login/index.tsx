import { Layout } from 'antd';
import LoginForm from '../../components/login';
import Link from 'next/link';

const { Header, Content } = Layout;

export default function Login() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 24px' }}>
        <div style={{ color: '#fff', fontWeight: 600 }}>H8 Desenvolvimento de software</div>
      </Header>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <LoginForm />
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Link href="/register">Criar nova conta</Link>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
