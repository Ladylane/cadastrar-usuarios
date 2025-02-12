import {
  UseGuards,
  Post,
  Controller,
  HttpException,
  HttpStatus,
  Body,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { ResetPasswordDto } from '../model/reset-password.dto';
import { SendCodeDto } from '../model/send-code.dto';
import { LoginDto } from '../model/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email);
  }

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() sendCodeDto: SendCodeDto) {
    const result = await this.authService.sendPasswordResetCode(
      sendCodeDto.email,
    );
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Foi enviado um codigo para redefinicao de senha.' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body()
    resetPasswordDto: ResetPasswordDto,
  ) {
    const result = await this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    );
    if (!result) {
      throw new HttpException('Invalid code or email', HttpStatus.BAD_REQUEST);
    }
    return { message: 'Redefinacao de senha executada com sucesso' };
  }
}
