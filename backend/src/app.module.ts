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

const dbUrl = process.env.DATABASE_URL || 'postgresql://accounting:accountpass@localhost:5432/accounting';
console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('🔍 Using DB URL:', dbUrl.replace(/:[^:@]+@/, ':***@')); // Hide password

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: dbUrl,
      entities: [User, ClientEntity, Attachment, Expense],
      synchronize: true,
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
    }),
    AuthModule,
    ClientsModule
  ]
})
export class AppModule {}
