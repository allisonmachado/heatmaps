import { IsDateString } from 'class-validator';

export class BinaryLogCreateInput {
  @IsDateString()
  day: string;
}
