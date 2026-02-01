import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ClientsModule } from './clients/clients.module';
import { Client as ClientEntity } from './clients/client.entity';
import { Attachment } from './clients/attachment.entity';
import { Expense } from './clients/expense.entity';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;
const isProduction = !!dbUrl;

console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('🔍 Using:', isProduction ? 'PostgreSQL (prod)' : 'SQLite (local dev)');

const getTypeOrmConfig = () => {
  if (isProduction) {
    return {
      type: 'postgres' as const,
      url: dbUrl,
      ssl: { rejectUnauthorized: false },
      retryAttempts: 10,
      retryDelay: 5000,
      autoLoadEntities: true,
      connectTimeoutMS: 30000,
      maxQueryExecutionTime: 30000,
      extra: {
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        max: 10,
        min: 1,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
      },
      entities: [User, ClientEntity, Attachment, Expense],
      synchronize: true,
    };
  } else {
    return {
      type: 'sqlite' as const,
      database: './local_dev.db',
      entities: [User, ClientEntity, Attachment, Expense],
      synchronize: true,
    };
  }
};

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    AuthModule,
    ClientsModule
  ]
})
export class AppModule {}
