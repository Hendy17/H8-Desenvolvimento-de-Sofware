import { Layout, Card, Spin, Typography, Row, Col, Statistic, Button, Modal, Form, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useClienteDashboard } from '../../hooks/cliente/useClienteDashboard';
import styles from './styles.module.css';

const { Content } = Layout;
const { Title } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

export default function ClienteDashboard() {
  const { 
    loading, 
    data, 
    cnpj, 
    handleVoltar,
    uploadOpen,
    setUploadOpen,
    fileList,
    setFileList,
    uploading,
    handleUploadSubmit,
  } = useClienteDashboard();

  if (loading) {
    return (
      <Layout className={styles.layout}>
        <Content className={styles.content}>
          <div className={styles.spinContainer}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout className={styles.layout}>
        <Content className={styles.content}>
          <Card>
            <Title level={3}>Cliente não encontrado</Title>
          </Card>
        </Content>
      </Layout>
    );
  }

  const chartData = data.expenses.map((exp) => ({
    name: exp.category,
    value: parseFloat(exp.total),
  }));

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);
  const biggestCategory = chartData.length > 0 ? chartData[0] : null;

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Card className={styles.headerCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2}>{data.client.name}</Title>
              <p>CNPJ: {cnpj}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                icon={<UploadOutlined />}
                size="large"
                onClick={() => setUploadOpen(true)}
              >
                Anexar Planilhas
              </Button>
              <Button 
                type="primary" 
                size="large"
                onClick={handleVoltar}
              >
                Voltar
              </Button>
            </div>
          </div>
        </Card>

        <Row gutter={16} className={styles.statsRow}>
          <Col span={12}>
            <Card>
              <Statistic
                title="Total de Despesas"
                value={totalExpenses}
                precision={2}
                prefix="R$"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Maior Categoria"
                value={biggestCategory ? biggestCategory.name : 'N/A'}
                valueStyle={{ fontSize: '20px' }}
              />
              {biggestCategory && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#888' }}>
                  R$ {biggestCategory.value.toFixed(2)}
                </p>
              )}
            </Card>
          </Col>
        </Row>

        <Card title="Despesas por Categoria" className={styles.chartCard}>
          {chartData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <div style={{ flex: '0 0 500px' }}>
                <ResponsiveContainer width="100%" height={500}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={160}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [`R$ ${value.toFixed(2)}`, name]}
                      contentStyle={{ fontSize: '14px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1 }}>
                {chartData.map((item, index) => {
                  const percent = ((item.value / totalExpenses) * 100).toFixed(1);
                  return (
                    <div 
                      key={item.name} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '16px',
                        fontSize: '16px'
                      }}
                    >
                      <div 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: COLORS[index % COLORS.length],
                          marginRight: '12px',
                          borderRadius: '3px'
                        }}
                      />
                      <span style={{ fontWeight: 500 }}>
                        {item.name}: R$ {item.value.toFixed(2)} ({percent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p>Nenhuma despesa registrada para este cliente.</p>
          )}
        </Card>

        {/* Modal de Upload */}
        <Modal
          visible={uploadOpen}
          onCancel={() => setUploadOpen(false)}
          title="Anexar Planilhas de Gastos"
          footer={[
            <Button key="cancel" onClick={() => setUploadOpen(false)}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" loading={uploading} onClick={handleUploadSubmit}>
              {uploading ? 'Enviando...' : 'Enviar'}
            </Button>,
          ]}
        >
          <Form.Item label="Selecione os arquivos">
            <Upload
              beforeUpload={() => false}
              multiple
              fileList={fileList}
              onChange={({ fileList: fl }) => setFileList(fl)}
            >
              <Button icon={<UploadOutlined />}>Selecionar arquivos</Button>
            </Upload>
          </Form.Item>
        </Modal>
      </Content>
    </Layout>
  );
}
