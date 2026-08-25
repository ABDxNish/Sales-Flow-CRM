import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { Company } from '../companies/company.entity';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
@Module({ imports: [TypeOrmModule.forFeature([Contact, Company])], providers: [ContactsService], controllers: [ContactsController] })
export class ContactsModule {}
