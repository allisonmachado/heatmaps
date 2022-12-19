import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class DateRange {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
