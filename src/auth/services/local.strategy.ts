import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /*
     - The validate() method is called by Passport after the authentication strategy is executed.
     - It receives the input data and must return an object representing the authenticated user.
     - If the user is not found, the method should throw an UnauthorizedException.
 */
  async validate(email: string, password: string): Promise<any> {
    console.log('Local Strategy - email:', email, 'password:', password);
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }
}
