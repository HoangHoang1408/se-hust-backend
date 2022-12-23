import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'express';
import * as Joi from 'joi';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ACCESS_TOKEN } from './common/constants/constants';
import { DataModule } from './data/data.module';
import { FirebaseModule } from './firebase/firebase.module';
import { HoKhau } from './hokhau/entity/hokhau.entity';
import { LichSuHoKhau } from './hokhau/entity/lichsuhokhau.entity';
import { TamTru } from './hokhau/entity/tamtru.entity';
import { TamVang } from './hokhau/entity/tamvang.entity';
import { HokhauModule } from './hokhau/hokhau.module';
import { SMSModule } from './sms/sms.module';
import { UploadModule } from './upload/upload.module';

import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? './src/env/.dev.env'
          : './src/env/.test.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        COMPANY_NAME: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.string().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        FIREBASE_API_KEY: Joi.string().required(),
        FIREBASE_AUTH_DOMAIN: Joi.string().required(),
        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_STORAGE_BUCKET: Joi.string().required(),
        FIREBASE_APP_ID: Joi.string().required(),
        CLIENT_DOMAIN: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      autoSchemaFile: join(process.cwd(), 'src/generated/schema.gql'),
      playground: true,
      context: ({ req, res }: { req: Request; res: Response }) => {
        return { req, res, [ACCESS_TOKEN]: req.get(ACCESS_TOKEN) };
      },
      cors: {
        origin: [process.env.CLIENT_DOMAIN, process.env.DEV_DOMAIN],
        credentials: true,
      },
    }),
    SMSModule.forRoot({
      accountSID: process.env.SMS_ACCOUNT_SID,
      authToken: process.env.SMS_ACCOUNT_AUTH_TOKEN,
    }),
    FirebaseModule.forRoot({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      appId: process.env.FIREBASE_APP_ID,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? {
            url: process.env.DATABASE_URL,
          }
        : {
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
          }),
      entities: [User, HoKhau, LichSuHoKhau, TamTru, TamVang],
      synchronize: true,
      ...(process.env.NODE_ENV === 'production'
        ? {
            ssl: true,
            extra: {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            },
          }
        : {}),
    }),
    UserModule,
    AuthModule,
    DataModule,
    HokhauModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
