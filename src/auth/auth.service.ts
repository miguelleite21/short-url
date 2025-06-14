import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from '@mikro-orm/postgresql';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const existing = await this.em.findOne(User, { email });
    if (existing) throw new BadRequestException('Email is already registered');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.em.create(User, {
      email, passwordHash: hashed
    });
    await this.em.persistAndFlush(user);
    return user;
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.em.findOne(User, { email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token };
  }
}
