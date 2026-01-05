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
  
  app.enableCors({ 
    origin: true,
    credentials: true 
  });
  
  app.use(cookieParser());
  await app.listen(port);
  console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
