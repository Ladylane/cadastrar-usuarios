import { Module } from '@nestjs/common';
import { HomeController } from './controllers/home.controller';
import { UserService } from 'src/user/services/user.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [HomeController],
  providers: [UserService],
})
export class HomeModule {}
