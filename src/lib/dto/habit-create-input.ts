import { IsString } from 'class-validator';

export class HabitCreateInput {
  @IsString()
  title: string;

  @IsString()
  color: string;

  type: 'binary' | 'timer';
}
