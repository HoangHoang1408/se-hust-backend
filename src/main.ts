import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [process.env.CLIENT_DOMAIN, process.env.DEV_DOMAIN="http://localhost:5173"],
      credentials: true,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 4000);
}
bootstrap().then(() => {
  console.log('App started!');
});
