import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

async function run() {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USER || 'account',
    password: process.env.POSTGRES_PASSWORD || 'accountpass',
    database: process.env.POSTGRES_DB || 'accounting',
    entities: [User],
    synchronize: true
  });

  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await repo.findOne({ where: { email } });
  if (existing) {
    console.log('Admin already exists:', email);
    await AppDataSource.destroy();
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = repo.create({ email, password: hashed, role: 'admin' });
  await repo.save(user);
  console.log('Created admin:', email);
  await AppDataSource.destroy();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
