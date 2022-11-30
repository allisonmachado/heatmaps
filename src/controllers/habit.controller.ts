import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  Response,
} from '@nestjs/common';
import { Response as ExpResponse } from 'express';
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
    @Param('id', ParseIntPipe) id: number,
    @Body() habit: HabitUpdateInput,
    @Request() req: AuthenticatedRequest,
    @Response() res: ExpResponse,
  ) {
    const count = await this.habitService.updateUserHabit(
      id,
      habit,
      req.user.id,
    );

    if (!count) {
      res.status(HttpStatus.NOT_FOUND).send();
    } else {
      res.status(HttpStatus.OK).send();
    }
  }
}
