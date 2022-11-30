import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PrismaConnector } from './lib/db/prisma.connector';
import { LocalStrategy } from './lib/auth/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './lib/auth/jwt.strategy';
import { JwtAuthGuard } from './lib/auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { HabitController } from './controllers/habit.controller';
import { HabitService } from './services/habit.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '86400s',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, HabitController],
  providers: [
    UserService,
    PrismaConnector,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      // verify jwt in all requests
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    HabitService,
  ],
})
export class AppModule {}
