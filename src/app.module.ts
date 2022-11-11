import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { PrismaConnector } from './lib/prisma-connector';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UserService, PrismaConnector, AuthService],
})
export class AppModule {}
