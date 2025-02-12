import { IsEmail, MinLength, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  email: string;

  @IsString()
  code: string;

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  newPassword: string;
}
