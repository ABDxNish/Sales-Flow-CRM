import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealDto } from './dto/deal.dto';
import { DealQueryDto } from './dto/deal-query.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { AuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(AuthGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly service: DealsService) {}
  @Get() all(@Query() query: DealQueryDto) { return this.service.findAll(query); }
  @Get('pipeline/all') pipeline() { return this.service.findPipeline(); }
  @Get(':id') one(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() dto: DealDto, @CurrentUser() user: { id: string }) { return this.service.create(dto, user.id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: DealDto, @CurrentUser() user: { id: string }) { return this.service.update(id, dto, user.id); }
  @Patch(':id/stage') stage(@Param('id') id: string, @Body() dto: UpdateStageDto, @CurrentUser() user: { id: string }) { return this.service.updateStage(id, dto.stage, user.id); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
