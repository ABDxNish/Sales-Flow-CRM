import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDto } from './dto/contact.dto';
import { PaginationDto } from '../common/pagination.dto';
import { AuthGuard } from '../common/auth.guard';
@UseGuards(AuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly service: ContactsService) {}
  @Get() all(@Query() query: PaginationDto) { return this.service.findAll(query); }
  @Get(':id') one(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() dto: ContactDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: ContactDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
