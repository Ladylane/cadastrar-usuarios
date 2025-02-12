import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../model/user.dto';
import { UserService } from '../services/user.service';
import { AddressService } from '../services/adress.service';

@Controller()
export class UserController {
  constructor(
    private readonly addressService: AddressService,
    private readonly userService: UserService
  ) {}

  @Post('register')
  async register(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    try {
      const user: CreateUserDto = {
        name: createUserDto.name,
        email: createUserDto.email.toLowerCase(),
        password: createUserDto.password,
        passwordConfirm: createUserDto.passwordConfirm,
        address: createUserDto.address,
      };

      const result = await this.userService.create(user);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        console.error('Conflict Error:', error.message);
        res.status(HttpStatus.CONFLICT).json({ message: error.message });
      } else if (error instanceof BadRequestException) {
        console.error('Bad Request Error:', error.message);
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        console.error('Unexpected Error:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message:
            'Ops, erro ao tentar cadastrar o usuario, por favor tente mais tarde!',
        });
      }
    }
  }

  @Get('address')
  async getAddress(@Res() res: Response, @Query('cep') cep: string) {
    console.log('Fetching CEP by: ', cep);
    const address = await this.addressService.getAddressByZipCode(cep);
    if (address) {
      console.log('VIA CEP Address: ', address);
      res.status(HttpStatus.OK).json(address);
    } else {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Ops, nao foi encontrado um endereco para este CEP' });
    }
  }
}
