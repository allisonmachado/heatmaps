import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { LocalAuthGuard } from '../lib/auth/local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() { user }: { user: Omit<User, 'password'> }) {
    return this.authService.loginUser(user);
  }
}
