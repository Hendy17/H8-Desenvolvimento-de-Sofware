import { Container, Card, Loader, Title, Grid, Text, Button, Modal, Stack, Group, FileInput, Center, Box } from '@mantine/core';
import { IconUpload, IconArrowLeft } from '@tabler/icons-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import dynamic from 'next/dynamic';
import { PeriodFilter } from '../../components/period-filter/periodFilter';
import styles from '../../app/cliente/styles/cliente.module.css';
import { ClienteDashboardProps } from '../../types/cliente/clienteDashboard';

const ExpensesTable = dynamic(
  () => import('../../components/expenses-table').then(mod => mod.ExpensesTable),
  { ssr: false, loading: () => <Loader /> }
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

export function ClientDashboardComponent({
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
  periodType,
  selectedMonth,
  selectedQuarter,
  handlePeriodChange,
  handleMonthChange,
  handleQuarterChange,
  allExpenses,
  fetchAllExpenses,
  chartData,
  totalExpenses,
  totalEntradas,
  totalSaidas,
  saldoLiquido,
  biggestCategory,
}: ClienteDashboardProps) {
  if (loading) {
    return (
      <Container className={styles.layout}>
        <Box className={styles.content}>
          <Center className={styles.spinContainer}>
            <Loader size="lg" />
          </Center>
        </Box>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container className={styles.layout}>
        <Box className={styles.content}>
          <Card>
            <Title order={3}>Cliente não encontrado</Title>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container className={styles.layout}>
      <Box className={styles.content}>
        <Card className={styles.headerCard}>
          <Group justify="space-between" align="center">
            <Box>
              <Title order={2}>{data.client.name}</Title>
              <Text>CNPJ: {cnpj}</Text>
            </Box>
            <Group gap={12}>
              <Button 
                leftSection={<IconUpload size={16} />}
                size="md"
                onClick={() => setUploadOpen(true)}
              >
                Anexar Planilhas
              </Button>
              <Button 
                variant="filled"
                size="md"
                onClick={handleVoltar}
                leftSection={<IconArrowLeft size={16} />}
              >
                Voltar
              </Button>
            </Group>
          </Group>
        </Card>

        {/* Filtro de Período */}
        <PeriodFilter 
          periodType={periodType}
          selectedMonth={selectedMonth}
          selectedQuarter={selectedQuarter}
          onPeriodChange={handlePeriodChange}
          onMonthChange={handleMonthChange}
          onQuarterChange={handleQuarterChange}
        />

        <Grid gutter={16} className={styles.statsRow}>
          <Grid.Col span={4}>
            <Card>
              <Stack gap={8}>
                <Text size="sm" c="dimmed">💰 Total de Entradas</Text>
                <Text size="xl" fw={700} c="green">R$ {totalEntradas.toFixed(2)}</Text>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card>
              <Stack gap={8}>
                <Text size="sm" c="dimmed">💸 Total de Saídas</Text>
                <Text size="xl" fw={700} c="red">R$ {totalSaidas.toFixed(2)}</Text>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card>
              <Stack gap={8}>
                <Text size="sm" c="dimmed">📊 Saldo Líquido</Text>
                <Text 
                  size="xl" 
                  fw={700} 
                  c={saldoLiquido >= 0 ? 'green' : 'red'}
                >
                  R$ {saldoLiquido.toFixed(2)}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        <Card className={styles.chartCard}>
          <Card.Section p="md">
            <Title order={3}>Despesas por Categoria</Title>
          </Card.Section>
          {chartData.length > 0 ? (
            <Group gap={40} align="flex-start" style={{ padding: '16px' }}>
              <Box style={{ flex: '0 0 500px' }}>
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
              </Box>
              <Box style={{ flex: 1 }}>
                <Stack gap={16}>
                  {chartData.map((item, index) => {
                    const percent = ((item.value / totalExpenses) * 100).toFixed(1);
                    return (
                      <Group key={item.name} gap={12}>
                        <Box 
                          style={{ 
                            width: 16, 
                            height: 16, 
                            backgroundColor: COLORS[index % COLORS.length],
                            borderRadius: 3
                          }}
                        />
                        <Text fw={500}>
                          {item.name}: R$ {item.value.toFixed(2)} ({percent}%)
                        </Text>
                      </Group>
                    );
                  })}
                </Stack>
              </Box>
            </Group>
          ) : (
            <Text ta="center" c="dimmed">Nenhuma despesa registrada para este cliente.</Text>
          )}
        </Card>

        {/* Tabela de Despesas Editável */}
        <Card className={styles.expensesCard}>
          <Card.Section p="md">
            <Title order={3}>Lançamentos</Title>
          </Card.Section>
          <ExpensesTable 
            expenses={allExpenses}
            onExpensesChange={fetchAllExpenses}
          />
        </Card>

        {/* Modal de Upload */}
        <Modal
          opened={uploadOpen}
          onClose={() => setUploadOpen(false)}
          title="Anexar Planilhas de Gastos"
          size="md"
        >
          <Stack gap={20}>
            <Text size="sm" c="dimmed">
              Selecione os arquivos Excel (.xlsx) com as despesas:
            </Text>
            <FileInput
              placeholder="Clique para selecionar arquivos"
              multiple
              accept=".xlsx,.xls"
              value={fileList}
              onChange={setFileList}
              leftSection={<IconUpload size={16} />}
            />
            <Group justify="flex-end" gap={12}>
              <Button 
                variant="outline" 
                onClick={() => setUploadOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                loading={uploading} 
                onClick={handleUploadSubmit}
              >
                {uploading ? 'Enviando...' : 'Enviar'}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Box>
    </Container>
  );
}
