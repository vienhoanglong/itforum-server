import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/index';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configServer = app.get(ConfigService);
  setupSwagger(app);
  // app.enableCors();
  await app.listen(configServer.get<number>('PORT'));
}
bootstrap().catch((error) => console.log(error));
