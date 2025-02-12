import { IsNotEmpty, Matches } from 'class-validator';

export class AddressDto {
  @IsNotEmpty({ message: 'A rua é obrigatória' })
  street: string;

  @IsNotEmpty({ message: 'O número é obrigatório' })
  number: string;

  complement: string;

  @IsNotEmpty({ message: 'O bairro é obrigatório' })
  neighborhood: string;

  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  city: string;

  @IsNotEmpty({ message: 'O estado é obrigatório' })
  state: string;

  @IsNotEmpty({ message: 'O país é obrigatório' })
  country: string;

  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  @Matches(/^\d{8}$/, { message: 'O CEP deve estar no formato 12345678' })
  cep: string;
}
