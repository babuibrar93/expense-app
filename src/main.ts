import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:4200'], // Allow all origins in development
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.use(cookieParser());

  // Apply the Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable global serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Use ValidationPipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes unknown properties
      forbidNonWhitelisted: true, // Throws error on unknown properties
      transform: true, // Auto-transforms DTOs
    })
  );

  // Swagger Document Configration
  const config = new DocumentBuilder()
    .setTitle('Expense App API')
    .setDescription('API documentation for the Expense application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = configService.get<number>('PORT') || 5000;

  await app.listen(PORT, () => {
    console.log(`Server is & running on port ${PORT}`);
  });
}
bootstrap();
