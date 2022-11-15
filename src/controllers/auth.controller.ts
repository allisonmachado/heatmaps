import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { LocalAuthGuard } from '../lib/auth/local-auth.guard';
import { Public } from '../lib/decorators/public';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() { user }: { user: Omit<User, 'password'> }) {
    console.log(user);
    return this.authService.loginUser(user);
  }
}
