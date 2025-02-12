import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeModule } from './home/home.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin`,
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      renderPath: '/',
      serveStaticOptions: {
        index: 'login.html',
      },
    }),
    UserModule,
    AuthModule,
    HomeModule,
  ],
})
export class AppModule {}