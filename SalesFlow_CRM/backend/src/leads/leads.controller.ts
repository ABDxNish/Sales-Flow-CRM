import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadDto } from './dto/lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { AuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
@UseGuards(AuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly service:LeadsService){}
  @Get() all(@Query() query:LeadQueryDto){return this.service.findAll(query);}
  @Get(':id') one(@Param('id') id:string){return this.service.findOne(id);}
  @Post() create(@Body() dto:LeadDto){return this.service.create(dto);}
  @Post(':id/convert') convert(@Param('id') id:string,@CurrentUser() user:{id:string}){return this.service.convert(id,user.id);}
  @Patch(':id') update(@Param('id') id:string,@Body() dto:LeadDto){return this.service.update(id,dto);}
  @Delete(':id') remove(@Param('id') id:string){return this.service.remove(id);}
}
