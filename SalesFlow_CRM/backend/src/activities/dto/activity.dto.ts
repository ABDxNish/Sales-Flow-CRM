import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ActivityType } from '../../common/enums';
export class ActivityDto {
  @IsString() @MinLength(2) title: string;
  @IsEnum(ActivityType) type: ActivityType;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsBoolean() completed?: boolean;
  @IsOptional() @IsString() assignedToId?: string;
  @IsOptional() @IsString() leadId?: string;
  @IsOptional() @IsString() dealId?: string;
}
