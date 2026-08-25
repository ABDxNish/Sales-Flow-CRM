import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}
  @Get() mine(@CurrentUser() user: { id: string }) { return this.service.findMine(user.id); }
  @Patch('read-all') markAll(@CurrentUser() user: { id: string }) { return this.service.markAllRead(user.id); }
  @Patch(':id/read') mark(@Param('id') id: string, @CurrentUser() user: { id: string }) { return this.service.markRead(id, user.id); }
}
