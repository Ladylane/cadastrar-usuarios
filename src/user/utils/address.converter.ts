import { AddressDto } from '../model/user-address.dto';

export function convertViaCepToAddressDto(viaCepData: any): AddressDto {
  return {
    street: viaCepData.logradouro,
    number: '', // Default value or handle accordingly
    complement: viaCepData.complemento || '', // Default value or handle accordingly
    neighborhood: viaCepData.bairro,
    city: viaCepData.localidade,
    state: viaCepData.uf,
    country: 'Brazil', // Assuming country is always Brazil
    cep: viaCepData.cep,
  };
}