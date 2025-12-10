import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ClientsModule } from './clients/clients.module';
import { Client as ClientEntity } from './clients/client.entity';
import { Attachment } from './clients/attachment.entity';
import { Expense } from './clients/expense.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(
      process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [User, ClientEntity, Attachment, Expense],
            synchronize: true,
            ssl: { rejectUnauthorized: false }
          }
        : {
            type: 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            port: Number(process.env.POSTGRES_PORT || 5432),
            username: process.env.POSTGRES_USER || 'account',
            password: process.env.POSTGRES_PASSWORD || 'accountpass',
            database: process.env.POSTGRES_DB || 'accounting',
            entities: [User, ClientEntity, Attachment, Expense],
            synchronize: true
          }
    ),
    AuthModule,
    ClientsModule
  ]
})
export class AppModule {}
