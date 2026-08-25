import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { Lead } from '../leads/lead.entity';
import { Deal } from '../deals/deal.entity';
import { User } from '../users/user.entity';
import { NoteDto } from './dto/note.dto';
@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private repo:Repository<Note>,@InjectRepository(Lead) private leads:Repository<Lead>,@InjectRepository(Deal) private deals:Repository<Deal>,@InjectRepository(User) private users:Repository<User>){}
  async create(dto:NoteDto,userId:string){
    if(!dto.leadId && !dto.dealId) throw new BadRequestException('Select a lead or deal');
    const note=this.repo.create({content:dto.content});
    note.createdBy=await this.users.findOne({where:{id:userId}});
    if(dto.leadId) note.lead=await this.leads.findOne({where:{id:dto.leadId}});
    if(dto.dealId) note.deal=await this.deals.findOne({where:{id:dto.dealId}});
    return this.repo.save(note);
  }
  async remove(id:string,userId:string){const item=await this.repo.findOne({where:{id},relations:['createdBy']});if(!item)throw new NotFoundException('Note not found');if(item.createdBy?.id!==userId) throw new BadRequestException('You can only delete your own note');await this.repo.remove(item);return{message:'Note deleted'};}
}
