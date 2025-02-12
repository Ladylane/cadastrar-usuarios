import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { convertViaCepToAddressDto } from '../utils/address.converter';
import * as NodeCache from 'node-cache';

/**
 * Service for fetching and caching addresses by ZIP code.
 * - Uses an in-memory cache (expires in 1 hour) to optimize API requests.
 * - Fetches address data from ViaCEP API.
 * - Handles API errors and invalid ZIP codes.
 * 
 * @param cep - ZIP code to fetch the address for.
 * @returns The formatted address or null if not found.
 */

@Injectable()
export class AddressService {
  private cache: NodeCache;

  constructor(private readonly httpService: HttpService) {
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache expires in 1 hour
  }

  async getAddressByZipCode(cep: string): Promise<any> {
    const cachedAddress = this.cache.get(cep);
    if (cachedAddress) {
      console.log('Returning cached address for:', cep);
      return cachedAddress;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      if (response.data.erro) {
        console.error('Via Cep error:', response.data);
        return null;
      }
      const address = convertViaCepToAddressDto(response.data);
      this.cache.set(cep, address);
      return address;
    } catch (error) {
      console.error('Via Cep Generic Error:', error);
      return null;
    }
  }
}
