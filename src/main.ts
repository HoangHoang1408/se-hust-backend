import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        process.env.CLIENT_DOMAIN,
        process.env.DEV_DOMAIN,
        process.env.DEV_DOMAIN_2,
      ],
      credentials: true,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 4000);
}
bootstrap().then(() => {
  console.log('App started!');
});
