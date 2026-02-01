import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { DatabaseModule } from './database/database.module';
import 'dotenv/config';

console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('🔍 Environment:', process.env.NODE_ENV || 'development');

@Module({
  imports: [
    DatabaseModule.forRoot(),
    AuthModule,
    ClientsModule
  ]
})
export class AppModule {}
