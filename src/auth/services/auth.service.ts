import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../user/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import {
  PasswordReset,
  PasswordResetDocument,
} from '../schema/password-recovery.schema';
import { EmailService } from '../../email/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(PasswordReset.name)
    private passwordResetModel: Model<PasswordResetDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('AuthService - validateUser:', email, 'password:', password);
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      console.log('AuthService - validateUser: user not found');
      return null;
    }

    /*
       - The bcrypt compare() method compares the provided password with the password stored in the database.
       - If the passwords match, the method returns true.
       - Otherwise, it returns false.
    */
    if (user && (await bcrypt.compare(password, user.password))) {
      return { email: user.email };
    }
    return null;
  }

  async login(email: string) {
    console.log('AuthService- login: ', email);
    const payload = { username: email, sub: email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
 * Generates and sends a password reset code to the user's email.
 * - Checks if the email exists in the database.
 * - Generates a 6-character reset code (hex format, uppercase).
 * - Stores the reset code with a 1-hour expiration.
 * - Sends the reset code via email.
 * 
 * @param email - The user's email to receive the reset code.
 * @returns `true` if the reset code was sent, `false` if the email was not found.
 */

  async sendPasswordResetCode(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return false;
    }

    const resetCode = randomBytes(3).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour
    await this.passwordResetModel.create({
      userId: user._id,
      resetCode,
      expiresAt,
    });

    // Send the code to the user's email (implement email sending)
    console.log(`Password reset code for ${email}: ${resetCode}`);
    await this.emailService.sendPasswordResetEmail(email, resetCode);
    return true;
  }

  /**
 * Resets the user's password using a valid reset code.
 * - Verifies if the email exists in the database.
 * - Checks if the reset code is valid and not expired.
 * - Hashes and updates the user's password.
 * - Deletes the used reset code from the database.
 * 
 * @param email - The user's email associated with the reset request.
 * @param code - The reset code received by the user.
 * @param newPassword - The new password to be set.
 * @returns `true` if the password was successfully reset, `false` otherwise.
 */

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      console.log('AuthService - resetPassword: user not found');
      return false;
    }

    const passwordReset = await this.passwordResetModel
      .findOne({
        userId: user._id,
        resetCode: code,
        expiresAt: { $gt: new Date() },
      })
      .exec();

    if (!passwordReset) {
      console.log('AuthService - resetPassword code not found or expired');
      return false;
    }

    user.password = await bcrypt.hash(String(newPassword), 10);
    await user.save();

    // Delete code used from the database
    await this.passwordResetModel.deleteOne({ _id: passwordReset._id }).exec();
    return true;
  }
}
