import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './note.entity';import { Lead } from '../leads/lead.entity';import { Deal } from '../deals/deal.entity';import { User } from '../users/user.entity';import { NotesService } from './notes.service';import { NotesController } from './notes.controller';
@Module({imports:[TypeOrmModule.forFeature([Note,Lead,Deal,User])],providers:[NotesService],controllers:[NotesController]})export class NotesModule{}
