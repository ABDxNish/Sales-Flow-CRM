import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './lead.entity';
import { Company } from '../companies/company.entity';
import { Contact } from '../contacts/contact.entity';
import { User } from '../users/user.entity';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { DealsModule } from '../deals/deals.module';
@Module({ imports:[TypeOrmModule.forFeature([Lead,Company,Contact,User]),NotificationsModule,DealsModule],providers:[LeadsService],controllers:[LeadsController] })
export class LeadsModule{}
