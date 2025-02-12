import { IsEmail } from 'class-validator';

export class SendCodeDto {
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  email: string;
}
