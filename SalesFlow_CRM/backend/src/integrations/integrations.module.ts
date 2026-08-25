import { Global, Module } from '@nestjs/common';
import { RealtimeService } from './realtime.service';
import { MailService } from './mail.service';

@Global()
@Module({
  providers: [RealtimeService, MailService],
  exports: [RealtimeService, MailService],
})
export class IntegrationsModule {}
