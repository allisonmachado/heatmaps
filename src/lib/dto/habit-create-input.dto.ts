import { IsIn, IsString, Length, Matches } from 'class-validator';

export class HabitCreateInput {
  @IsString()
  @Length(1, 245)
  title: string;

  @IsString()
  @Matches(/^([0-9A-F]{3}){1,2}$/i, {
    message: 'color must be a valid hex representation',
  })
  color: string;

  @IsString()
  @IsIn(['binary', 'timer'])
  type: 'binary' | 'timer';
}
