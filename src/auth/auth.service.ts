import { Injectable, Dependencies, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
@Dependencies(UsersService)
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
}