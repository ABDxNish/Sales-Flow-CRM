import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { DealStage } from '../../common/enums';
export class DealDto {
  @IsString() @MinLength(2) title: string;
  @Type(() => Number) @IsNumber() @Min(0) value: number;
  @IsOptional() @IsEnum(DealStage) stage?: DealStage;
  @IsOptional() @IsDateString() expectedCloseDate?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() companyId?: string;
  @IsOptional() @IsString() contactId?: string;
  @IsOptional() @IsString() assignedToId?: string;
}
