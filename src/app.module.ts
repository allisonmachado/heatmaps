import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PrismaConnector } from './lib/db/prisma.connector';
import { LocalStrategy } from './lib/auth/local.strategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [UserService, PrismaConnector, AuthService, LocalStrategy],
})
export class AppModule {}
