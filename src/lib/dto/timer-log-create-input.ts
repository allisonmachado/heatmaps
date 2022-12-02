import { IsDateString, IsInt, Min } from 'class-validator';

export class TimerLogCreateInput {
  @IsDateString()
  day: string;

  @IsInt()
  @Min(1)
  timerValue: string;
}
