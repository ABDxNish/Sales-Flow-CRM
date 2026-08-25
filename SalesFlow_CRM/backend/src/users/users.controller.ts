import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../common/auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../common/enums';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('options') options() { return this.service.findAll(); }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get() all() { return this.service.findAll(); }

  @Get('profile/me')
  me(@CurrentUser() user: { id: string }) { return this.service.findOne(user.id); }

  @Patch('profile/me')
  updateMe(@CurrentUser() user: { id: string }, @Body() dto: UpdateProfileDto) { return this.service.updateProfile(user.id, dto); }

  @Roles(UserRole.ADMIN)
  @Post() create(@Body() dto: CreateUserDto) { return this.service.create(dto); }

  @Roles(UserRole.ADMIN)
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateUserDto) { return this.service.update(id, dto); }

  @Roles(UserRole.ADMIN)
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
