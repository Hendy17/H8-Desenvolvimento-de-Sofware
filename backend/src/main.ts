import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Iniciando aplicação...');
    
    // Validação de variáveis de ambiente críticas
    if (process.env.DATABASE_URL) {
      console.log('🔍 DATABASE_URL detectada - modo produção');
      console.log('🔍 DATABASE_URL format:', process.env.DATABASE_URL.substring(0, 20) + '...');
    } else {
      console.log('🔍 Modo desenvolvimento - usando SQLite');
    }
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });
    
    // Configurar CORS corretamente para funcionar com credentials
    app.enableCors({
      origin: (origin, callback) => {
        // URLs permitidas
        const allowedOrigins = [
          'http://localhost:3000', 
          'http://localhost:3001',
          /^https:\/\/h8-desenvolvimento-de-sofware.*\.vercel\.app$/,
          'https://h8-desenvolvimento-de-sofware.vercel.app'
        ];
        
        // Se não há origin (ex: requests do Postman) ou se o origin está na lista permitida
        if (!origin || allowedOrigins.some(allowed => 
          typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
        )) {
          callback(null, true);
        } else {
          callback(new Error('Não permitido pelo CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    
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
  
  console.log(`✅ Backend rodando na porta ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (!process.env.PORT) {
    console.log(`🔗 Acesse: http://localhost:${port}`);
  }
  
  } catch (error) {
    console.error('❌ Erro fatal ao inicializar aplicação:', error);
    
    // Log detalhado do erro para debug
    if (error.message?.includes('database') || error.message?.includes('connection')) {
      console.error('🔍 Erro relacionado ao banco de dados:');
      console.error('- DATABASE_URL presente:', !!process.env.DATABASE_URL);
      console.error('- NODE_ENV:', process.env.NODE_ENV);
      console.error('- Mensagem:', error.message);
    }
    
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap falhou:', error);
  process.exit(1);
});
