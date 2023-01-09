import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  Response,
} from '@nestjs/common';
import { Response as ExpResponse } from 'express';
import { AuthenticatedRequest } from '../lib/dto/authenticated-request.dto';
import { DateRange } from '../lib/dto/date-range';
import { HabitCreateInput } from '../lib/dto/habit-create-input.dto';
import { HabitUpdateInput } from '../lib/dto/habit-update-input.dto';
import { LogCreateInput } from '../lib/dto/log-create-input.dto';
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

  @Post('/:habitId/logs')
  async logUserHabit(
    @Param('habitId', ParseIntPipe) habitId: number,
    @Body() log: LogCreateInput,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      await this.habitService.logUserHabit(habitId, req.user.id, log);
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

  @Delete('/:id')
  async deleteUserHabit(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
    @Response() res: ExpResponse,
  ) {
    const isDeleted = await this.habitService.deleteUserHabit(id, req.user.id);

    if (isDeleted) {
      res.status(HttpStatus.OK).send();
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }

  @Delete('/:habitId/logs/:habitLogId')
  async deleteUserHabitLog(
    @Param('habitId', ParseIntPipe) habitId: number,
    @Param('habitLogId', ParseIntPipe) habitLogId: number,
    @Request() req: AuthenticatedRequest,
    @Response() res: ExpResponse,
  ) {
    const isDeleted = await this.habitService.deleteUserHabitLog(
      habitId,
      habitLogId,
      req.user.id,
    );

    if (isDeleted) {
      res.status(HttpStatus.OK).send();
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }

  @Get('/:id/logs')
  async listUserHabitLog(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: DateRange,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.habitService.listUserHabitLogs(
      req.user.id,
      id,
      query.startDate,
      query.endDate,
    );
  }
}
