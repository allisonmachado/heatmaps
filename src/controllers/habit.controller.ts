import {
  Body,
  Controller,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../lib/dto/authenticated-request';
import { HabitCreateInput } from '../lib/dto/habit-create-input';
import { HabitService } from '../services/habit.service';

@Controller('habits')
export class HabitController {
  constructor(private habitService: HabitService) {}

  @Post('/')
  async createUserHabit(
    @Body(ValidationPipe) habit: HabitCreateInput,
    @Request() req: AuthenticatedRequest,
  ) {
    await this.habitService.createUserHabit(habit, req.user.id);
  }
}
