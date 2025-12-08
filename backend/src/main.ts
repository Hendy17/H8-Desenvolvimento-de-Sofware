import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
// use require to load cookie-parser for compatibility with commonjs export
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || process.env.PORT_BACKEND || 3001;
  const front = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
  
  // Configure CORS for development and production
  const allowedOrigins = [front];
  
  // In production, also allow Vercel domain if provided
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_URL) {
    allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
  }
  
  app.enableCors({ 
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true 
  });
  
  app.use(cookieParser());
  await app.listen(port);
  console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
