import { Controller, Post, Request } from '@nestjs/common';

@Controller('habits')
export class HabitController {
  @Post('/')
  async createUserHabit(@Request() req) {
    console.log(req.body);
    return true;
  }
}
