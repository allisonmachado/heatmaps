import { Body, Controller, Param, Post, Put, Request } from '@nestjs/common';
import { AuthenticatedRequest } from '../lib/dto/authenticated-request';
import { HabitCreateInput } from '../lib/dto/habit-create-input';
import { HabitUpdateInput } from '../lib/dto/habit-update-input';
import { HabitService } from '../services/habit.service';

@Controller('habits')
export class HabitController {
  constructor(private habitService: HabitService) {}

  @Post('/')
  async createUserHabit(
    @Body() habit: HabitCreateInput,
    @Request() req: AuthenticatedRequest,
  ) {
    await this.habitService.createUserHabit(habit, req.user.id);
  }

  @Put('/:id')
  async updateUserHabit(
    @Param('id') id: string,
    @Body() habit: HabitUpdateInput,
    @Request() req: AuthenticatedRequest,
  ) {
    console.log('id -> ', id);
    console.log('habit -> ', habit);
    console.log('req.user -> ', req.user);
  }
}
