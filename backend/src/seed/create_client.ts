import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { Client } from '../clients/client.entity';

async function run() {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USER || 'account',
    password: process.env.POSTGRES_PASSWORD || 'accountpass',
    database: process.env.POSTGRES_DB || 'accounting',
    entities: [Client],
    synchronize: true,
  });

  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Client);

  const cnpjEnv = process.env.CREATE_CLIENT_CNPJ || '00000000000191';
  const name = process.env.CREATE_CLIENT_NAME || 'Cliente Teste';
  const address = process.env.CREATE_CLIENT_ADDRESS || 'Rua Exemplo, 123';

  const normalized = cnpjEnv.replace(/\D/g, '');
  let existing = await repo.findOne({ where: { cnpj: normalized } });
  if (existing) {
    console.log('Client already exists:', existing.cnpj, existing.name);
  } else {
    const client = repo.create({ cnpj: normalized, name, address });
    await repo.save(client);
    console.log('Created client:', client.cnpj, client.name);
  }

  await AppDataSource.destroy();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
