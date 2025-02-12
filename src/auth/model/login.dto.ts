import { IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  email: string;
}
