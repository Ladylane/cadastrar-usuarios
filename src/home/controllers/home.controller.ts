import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/services/user.service';
import { JwtAuthGuard } from '../../auth/services/jwt-auth.guard';

@Controller()
export class HomeController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers(@Res() res: Response) {
    const users = await this.userService.findAllUsers();
    if (users) {
      res.status(HttpStatus.OK).json(users);
    } else {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Nao foram encontrados usuarios.' });
    }
  }
}
