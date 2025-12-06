import { DataSource } from 'typeorm';
import { Client } from '../clients/client.entity';
import { Expense } from '../clients/expense.entity';

async function createExpenses() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'account',
    password: 'accountpass',
    database: 'accounting',
    entities: [Client, Expense],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Conectado ao DB');

  const clientRepo = dataSource.getRepository(Client);
  const expenseRepo = dataSource.getRepository(Expense);

  // Find test client
  const cnpj = '00000000000191';
  let client = await clientRepo.findOne({ where: { cnpj } });
  if (!client) {
    console.log('Cliente não encontrado. Criando cliente de teste...');
    client = clientRepo.create({ cnpj, name: 'Cliente Teste', address: 'Endereço Teste' });
    await clientRepo.save(client);
    console.log('Cliente criado!');
  }

  console.log(`Cliente encontrado: ${client.name}`);

  // Create sample expenses
  const expenses = [
    { category: 'Salários', description: 'Folha de pagamento mensal', amount: 45000.00, date: new Date('2024-01-15') },
    { category: 'Aluguel', description: 'Aluguel do escritório', amount: 8500.00, date: new Date('2024-01-05') },
    { category: 'Impostos', description: 'INSS e FGTS', amount: 12000.00, date: new Date('2024-01-20') },
    { category: 'Fornecedores', description: 'Compra de materiais', amount: 18500.00, date: new Date('2024-01-10') },
    { category: 'Energia', description: 'Conta de luz', amount: 3200.00, date: new Date('2024-01-08') },
    { category: 'Internet', description: 'Provedor de internet', amount: 850.00, date: new Date('2024-01-03') },
    { category: 'Marketing', description: 'Campanha digital', amount: 6500.00, date: new Date('2024-01-12') },
    { category: 'Manutenção', description: 'Reparos no escritório', amount: 2200.00, date: new Date('2024-01-18') },
    { category: 'Telefonia', description: 'Conta de telefone', amount: 1500.00, date: new Date('2024-01-07') },
    { category: 'Transporte', description: 'Combustível e pedágios', amount: 4800.00, date: new Date('2024-01-14') },
  ];

  for (const exp of expenses) {
    const existing = await expenseRepo.findOne({ where: { client: { id: client.id }, category: exp.category } });
    if (!existing) {
      const expense = expenseRepo.create({ category: exp.category, description: exp.description, amount: exp.amount, date: exp.date });
      expense.client = client;
      await expenseRepo.save(expense);
      console.log(`Despesa criada: ${exp.category} - R$ ${exp.amount}`);
    } else {
      console.log(`Despesa já existe: ${exp.category}`);
    }
  }

  console.log('Despesas criadas com sucesso!');
  await dataSource.destroy();
}

createExpenses().catch(console.error);
