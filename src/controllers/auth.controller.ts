import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../lib/auth/local-auth.guard';
import { Public } from '../lib/decorators/public';
import { User } from '../lib/dto/user';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() { user }: { user: User }) {
    return this.authService.loginUser(user);
  }
}
