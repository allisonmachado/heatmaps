import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  Response,
} from '@nestjs/common';
import { Response as ExpResponse } from 'express';
import { AuthenticatedRequest } from '../lib/dto/authenticated-request';
import { BinaryLogCreateInput } from '../lib/dto/binary-log-create-input';
import { HabitCreateInput } from '../lib/dto/habit-create-input';
import { HabitUpdateInput } from '../lib/dto/habit-update-input';
import { LogTypes } from '../lib/dto/log-types';
import { ForbiddenAccess } from '../lib/errors/forbidden-access';
import { EntityNotFound } from '../lib/errors/habit-not-found';
import { InvalidType } from '../lib/errors/invalid-type';
import { UniqueConstraintFail } from '../lib/errors/unique-constraint-fail';
import { HabitService } from '../services/habit.service';

@Controller('habits')
export class HabitController {
  private readonly logger = new Logger(HabitController.name);

  constructor(private habitService: HabitService) {}

  @Post('/')
  async createUserHabit(
    @Body() habit: HabitCreateInput,
    @Request() req: AuthenticatedRequest,
  ) {
    await this.habitService.createUserHabit(habit, req.user.id);
  }

  @Get('/')
  async listUserHabits(@Request() req: AuthenticatedRequest) {
    return this.habitService.listUserHabits(req.user.id);
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

  @Post('/:habitId/logs/binary')
  async logUserBinaryHabit(
    @Param('habitId', ParseIntPipe) habitId: number,
    @Body() log: BinaryLogCreateInput,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      await this.habitService.logUserHabit(
        habitId,
        log,
        req.user.id,
        LogTypes.Binary,
      );
    } catch (error) {
      if (error instanceof EntityNotFound) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof InvalidType) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof ForbiddenAccess) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof UniqueConstraintFail) {
        throw new BadRequestException(error.message);
      }

      this.logger.error(error);
      throw error;
    }
  }
}
