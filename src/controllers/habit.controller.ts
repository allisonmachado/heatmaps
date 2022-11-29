import {
  Body,
  Controller,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../lib/dto/authenticated-request';
import { Habit } from '../lib/dto/habit';

@Controller('habits')
export class HabitController {
  @Post('/')
  async createUserHabit(
    @Body(ValidationPipe) habit: Habit,
    @Request() req: AuthenticatedRequest,
  ) {
    console.log('habit: ', habit);
    console.log('user: ', req.user);
    return true;
  }
}
