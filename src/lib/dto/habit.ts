import { IsString } from 'class-validator';

export class Habit {
  @IsString()
  title: string;

  @IsString()
  color: number;

  @IsString()
  type: string;
}
