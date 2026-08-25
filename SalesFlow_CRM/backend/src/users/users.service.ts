import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MailService } from '../integrations/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly mail: MailService,
  ) {}

  private safe(user: User) {
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) { return this.repo.findOne({ where: { email: email.toLowerCase() } }); }
  async findEntity(id: string) { return this.repo.findOne({ where: { id } }); }

  async create(dto: CreateUserDto) {
    if (await this.findByEmail(dto.email)) throw new ConflictException('Email is already in use');
    const user = this.repo.create({ ...dto, email: dto.email.toLowerCase(), password: await bcrypt.hash(dto.password, 10) });
    const saved = await this.repo.save(user);
    await this.mail.send(saved.email, 'CRM account created', `Hello ${saved.name}, your CRM account has been created.`);
    return this.safe(saved);
  }

  async createSalesUser(name: string, email: string, password: string, phone?: string) {
    if (await this.findByEmail(email)) throw new ConflictException('Email is already in use');
    const user = this.repo.create({ name, email: email.toLowerCase(), password: await bcrypt.hash(password, 10), phone });
    const saved = await this.repo.save(user);
    return this.safe(saved);
  }

  async findAll() {
    const users = await this.repo.find({ order: { createdAt: 'DESC' } });
    return users.map((user) => this.safe(user));
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.safe(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const found = await this.findByEmail(dto.email);
      if (found) throw new ConflictException('Email is already in use');
      user.email = dto.email.toLowerCase();
    }
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
    return this.safe(await this.repo.save(user));
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
    return this.safe(await this.repo.save(user));
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.repo.remove(user);
    return { message: 'User deleted' };
  }
}
