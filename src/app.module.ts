import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { PrismaConnector } from './lib/prisma-connector';

@Module({
  imports: [],
  controllers: [],
  providers: [UserService, PrismaConnector],
})
export class AppModule {}
