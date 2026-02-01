import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Client } from '../clients/client.entity';
import { Attachment } from '../clients/attachment.entity';
import { Expense } from '../clients/expense.entity';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const dbUrl = process.env.DATABASE_URL;
    const isProduction = !!dbUrl;
    
    if (!isProduction) {
      console.log('🔧 Modo desenvolvimento: usando SQLite');
      return {
        module: DatabaseModule,
        imports: [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: './local_dev.db',
            entities: [User, Client, Attachment, Expense],
            synchronize: true,
          })
        ],
        exports: [TypeOrmModule],
      };
    }

    console.log('🚀 Modo produção: conectando PostgreSQL...');
    
    // Em produção, DEVE conectar no PostgreSQL - sem fallback
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            console.log('🔗 Conectando PostgreSQL...');
            return {
              type: 'postgres' as const,
              url: dbUrl,
              ssl: { rejectUnauthorized: false },
              retryAttempts: 10,
              retryDelay: 3000,
              entities: [User, Client, Attachment, Expense],
              synchronize: true,
              logging: ['error'],
              // Pool de conexões otimizado para produção
              extra: {
                // Pool de conexões para alta carga
                max: 50,              // Máximo 50 conexões simultâneas
                min: 10,              // Mínimo 10 conexões sempre ativas
                acquire: 60000,       // Timeout para conseguir conexão (1 min)
                idle: 10000,          // Tempo para conexão ficar idle (10s)
                evict: 1000,          // Intervalo para limpar conexões idle (1s)
                
                // Timeouts de query para evitar travamentos
                statement_timeout: 30000,                    // 30s max por query
                query_timeout: 30000,                       // 30s max por query
                connectionTimeoutMillis: 10000,             // 10s para conectar
                idleTimeoutMillis: 30000,                   // 30s idle
                idle_in_transaction_session_timeout: 10000, // 10s em transação idle
                
                // Performance e estabilidade
                application_name: 'accounting_backend',
                keepAlive: true,
                keepAliveInitialDelayMillis: 10000,
              }
            };
          },
        })
      ],
      exports: [TypeOrmModule],
    };
  }
}