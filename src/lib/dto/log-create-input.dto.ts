import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, Min, ValidateIf } from 'class-validator';
import { LogTypes } from './log-types.dto';

export class LogCreateInput {
  @IsEnum(LogTypes)
  type: LogTypes;

  @IsDateString()
  day: string;

  @ValidateIf((o) => o.type === LogTypes.Timer)
  @Transform((o) =>
    o.obj.type === LogTypes.Timer ? o.obj.timerValue : undefined,
  )
  @IsInt()
  @Min(1)
  timerValue?: number;
}
