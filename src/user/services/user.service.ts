import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../model/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import * as bcrypt from 'bcrypt';

/**
 * Creates a new user in the database.
 * - Hashes the password before saving.
 * - Handles MongoDB duplicate email error (code 11000).
 * 
 * @param user - User data to be registered.
 * @returns The created user.
 * @throws ConflictException if the email is already registered.
 */

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });

    try {
      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error code
        throw new ConflictException(
          'Ops, tivemos um problema, e-mail já cadastrado',
        );
      }
      throw error;
    }
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
}
