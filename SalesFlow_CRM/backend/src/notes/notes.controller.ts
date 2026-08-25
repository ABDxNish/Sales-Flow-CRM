import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteDto } from './dto/note.dto';
import { AuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {constructor(private service:NotesService){}@Post()create(@Body()dto:NoteDto,@CurrentUser()user:{id:string}){return this.service.create(dto,user.id);}@Delete(':id')remove(@Param('id')id:string,@CurrentUser()user:{id:string}){return this.service.remove(id,user.id);}}
