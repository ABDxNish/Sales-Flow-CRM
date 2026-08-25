import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';import { User } from '../users/user.entity';import { Lead } from '../leads/lead.entity';import { Deal } from '../deals/deal.entity';import { ActivityDto } from './dto/activity.dto';
@Injectable()
export class ActivitiesService{
  constructor(@InjectRepository(Activity)private repo:Repository<Activity>,@InjectRepository(User)private users:Repository<User>,@InjectRepository(Lead)private leads:Repository<Lead>,@InjectRepository(Deal)private deals:Repository<Deal>){}
  async all(userId?:string){const qb=this.repo.createQueryBuilder('activity').leftJoinAndSelect('activity.assignedTo','assignedTo').leftJoinAndSelect('activity.lead','lead').leftJoinAndSelect('activity.deal','deal').orderBy('activity.dueDate','ASC').addOrderBy('activity.createdAt','DESC');if(userId)qb.andWhere('assignedTo.id = :userId',{userId});return qb.getMany();}
  async create(dto:ActivityDto){const {assignedToId,leadId,dealId,dueDate,...data}=dto;const item=this.repo.create({...data,dueDate:dueDate?new Date(dueDate):undefined});if(assignedToId)item.assignedTo=await this.users.findOne({where:{id:assignedToId}});if(leadId)item.lead=await this.leads.findOne({where:{id:leadId}});if(dealId)item.deal=await this.deals.findOne({where:{id:dealId}});return this.repo.save(item);}
  async update(id:string,dto:ActivityDto){const item=await this.repo.findOne({where:{id}});if(!item)throw new NotFoundException('Activity not found');const {assignedToId,leadId,dealId,dueDate,...data}=dto;Object.assign(item,data);item.dueDate=dueDate?new Date(dueDate):undefined;item.assignedTo=assignedToId?await this.users.findOne({where:{id:assignedToId}}):null;item.lead=leadId?await this.leads.findOne({where:{id:leadId}}):null;item.deal=dealId?await this.deals.findOne({where:{id:dealId}}):null;return this.repo.save(item);}
  async toggle(id:string){const item=await this.repo.findOne({where:{id}});if(!item)throw new NotFoundException('Activity not found');item.completed=!item.completed;return this.repo.save(item);}
  async remove(id:string){const item=await this.repo.findOne({where:{id}});if(!item)throw new NotFoundException('Activity not found');await this.repo.remove(item);return{message:'Activity deleted'};}
}
