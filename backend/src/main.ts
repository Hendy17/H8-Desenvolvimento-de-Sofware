import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // Health check endpoint simples
  const server = app.getHttpAdapter();
  server.get('/', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'Backend funcionando', 
      timestamp: new Date().toISOString() 
    });
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend rodando na porta ${port}`);
  if (!process.env.PORT) {
    console.log(`🔗 Acesse: http://localhost:${port}`);
  }
}
bootstrap();
