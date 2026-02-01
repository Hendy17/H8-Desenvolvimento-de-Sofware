import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // Health check endpoint completo
  const server = app.getHttpAdapter();
  server.get('/', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'Backend funcionando', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Endpoint de métricas do sistema
  server.get('/health', async (req, res) => {
    try {
      const memUsage = process.memoryUsage();
      const uptime = process.uptime();
      
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 60)} minutos`,
        memory: {
          used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        },
        database: process.env.DATABASE_URL ? 'connected' : 'local',
      });
    } catch (error) {
      res.status(503).json({ status: 'unhealthy', error: error.message });
    }
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend rodando na porta ${port}`);
  if (!process.env.PORT) {
    console.log(`🔗 Acesse: http://localhost:${port}`);
  }
}
bootstrap();
