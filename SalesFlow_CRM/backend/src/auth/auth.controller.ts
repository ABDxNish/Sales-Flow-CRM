import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '../common/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register') register(@Body() dto: RegisterDto) { return this.service.register(dto); }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const user = await this.service.validate(dto);
    req.session.user = user;
    return { message: 'Login successful', user };
  }

  @UseGuards(AuthGuard)
  @Get('me') me(@Req() req: Request) { return req.session.user; }

  @Post('logout')
  logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((error) => error ? reject(error) : resolve({ message: 'Logout successful' }));
    });
  }
}
