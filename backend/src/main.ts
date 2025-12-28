import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as fs from 'fs';

async function bootstrap() {
  let app;
  // Prefer HTTPS if certs are available, otherwise fallback to HTTP
  if (
    process.env.SSL_KEY_PATH &&
    process.env.SSL_CERT_PATH &&
    fs.existsSync(process.env.SSL_KEY_PATH) &&
    fs.existsSync(process.env.SSL_CERT_PATH)
  ) {
    const httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };
    app = await NestFactory.create(AppModule, { httpsOptions });
    console.log('HTTPS enabled');
  } else {
    app = await NestFactory.create(AppModule);
    console.log('HTTPS not enabled, running on HTTP');
  }
  app.enableCors({
    origin: true, // Reflects the request origin, effectively allows all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
  });
  // Listen on the port from env or default to 4000
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
