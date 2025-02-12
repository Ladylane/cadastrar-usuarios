import {
  IsEmail,
  MinLength,
  Matches,
  IsString,
  Validate,
} from 'class-validator';
import { MatchPasswords } from 'src/user/validator/match-passwords.validator';
import { AddressDto } from './user-address.dto';

export class CreateUserDto {
  @Matches(/^\S+\s+\S+/, { message: 'Informe o nome completo' })
  name: string;

  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  email: string;

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsString()
  @Validate(MatchPasswords, ['password'])
  passwordConfirm: string;

  address?: AddressDto;
}
