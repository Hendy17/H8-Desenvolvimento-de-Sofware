import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
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
      return this.createSqliteConfig();
    }

    console.log('🚀 Modo produção: conectando PostgreSQL...');
    
    // Em produção, tentar PostgreSQL primeiro, SQLite como fallback
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async (): Promise<TypeOrmModuleOptions> => {
            console.log('🔗 Conectando PostgreSQL...');
            
            try {
              // Configuração PostgreSQL para Render.com
              const pgConfig: TypeOrmModuleOptions = {
                type: 'postgres',
                url: dbUrl,
                // SSL obrigatório para Render.com
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
                retryAttempts: 5, // Reduzido para falhar mais rápido e tentar SQLite
                retryDelay: 2000,
                entities: [User, Client, Attachment, Expense],
                synchronize: true,
                logging: ['error', 'warn'] as ('query' | 'error' | 'schema' | 'warn' | 'info' | 'log' | 'migration')[],
                // Pool de conexões otimizado para Render.com
                extra: {
                  // Pool reduzido para Render (limite de conexões)
                  max: 20,
                  min: 5,
                  acquireTimeoutMillis: 30000,
                  idleTimeoutMillis: 30000,
                  
                  // Configurações PostgreSQL específicas
                  statement_timeout: 20000,
                  query_timeout: 20000,
                  application_name: 'accounting_backend',
                  keepAlive: true,
                  keepAliveInitialDelayMillis: 0,
                }
              };

              console.log('✅ PostgreSQL configurado com sucesso');
              return pgConfig;
              
            } catch (error) {
              console.error('❌ Falha ao conectar PostgreSQL:', error.message);
              console.log('🔄 Fallback para SQLite temporário...');
              
              // Fallback para SQLite em produção quando PostgreSQL falha
              const sqliteConfig: TypeOrmModuleOptions = {
                type: 'sqlite',
                database: './production_fallback.db',
                entities: [User, Client, Attachment, Expense],
                synchronize: true,
                logging: ['error', 'warn'] as ('query' | 'error' | 'schema' | 'warn' | 'info' | 'log' | 'migration')[],
              };
              
              return sqliteConfig;
            }
          },
        })
      ],
      exports: [TypeOrmModule],
    };
  }

  // Método auxiliar para configuração SQLite
  private static createSqliteConfig(): DynamicModule {
    const config: TypeOrmModuleOptions = {
      type: 'sqlite',
      database: './local_dev.db',
      entities: [User, Client, Attachment, Expense],
      synchronize: true,
      logging: ['error'] as ('query' | 'error' | 'schema' | 'warn' | 'info' | 'log' | 'migration')[],
    };
    
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forRoot(config)],
      exports: [TypeOrmModule],
    };
  }
}