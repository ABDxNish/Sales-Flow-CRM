import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './common/enums';

async function seed(){
 const app=await NestFactory.createApplicationContext(AppModule);
 const config=app.get(ConfigService);const users=app.get(UsersService);
 const email=config.get<string>('SEED_ADMIN_EMAIL')||'admin@crm.local';
 const existing=await users.findByEmail(email);
 if(existing){console.log(`Admin already exists: ${email}`);}else{
  await users.create({name:config.get<string>('SEED_ADMIN_NAME')||'CRM Admin',email,password:config.get<string>('SEED_ADMIN_PASSWORD')||'Admin123!',role:UserRole.ADMIN});
  console.log(`Admin created: ${email}`);
 }
 await app.close();
}
seed();
