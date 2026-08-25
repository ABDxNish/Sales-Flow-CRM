import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap(){
 const app=await NestFactory.create(AppModule);
 const config=app.get(ConfigService);
 app.enableCors({origin:config.get<string>('FRONTEND_URL')||'http://localhost:3200',credentials:true});
 app.use(session({secret:config.get<string>('SESSION_SECRET')||'development-secret-change-me',resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:'lax',secure:false,maxAge:1000*60*60*8}}));
 app.useGlobalPipes(new ValidationPipe({whitelist:true,transform:true}));
 await app.listen(Number(config.get('PORT',3001)));
 console.log(`CRM backend running at http://localhost:${config.get('PORT',3001)}`);
}
bootstrap();
