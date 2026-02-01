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
      return DatabaseModule.createSqliteConfig();
    }

    console.log('🚀 Modo produção: tentando PostgreSQL primeiro...');
    
    // FORÇAR FALLBACK PARA SQLITE EM PRODUÇÃO
    // Temporariamente usar SQLite até resolver problemas do Render
    console.log('🔄 TEMPORÁRIO: Usando SQLite em produção para estabilidade');
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './production.db',
          entities: [User, Client, Attachment, Expense],
          synchronize: true,
          logging: ['error'] as ('query' | 'error' | 'schema' | 'warn' | 'info' | 'log' | 'migration')[],
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