import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { SuperAdminSeeder } from './core/database/seeders/super-admin.seeder';
import { ExpenseSeeder } from './core/database/seeders/expense.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const superAdminSeeder = app.get(SuperAdminSeeder);
  await superAdminSeeder.seed();

  const expenseSeeder = app.get(ExpenseSeeder);
  await expenseSeeder.seed();

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:4200'], // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Cookie'],
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
    console.log(`Swagger Docs available at: http://localhost:${PORT}/api/docs`);
  });

  // Enable better debugging with full stack traces
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.stack);
    process.exit(1); // Force exit to prevent corrupted state
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1); // Ensure the process restarts properly
  });
}
bootstrap();
