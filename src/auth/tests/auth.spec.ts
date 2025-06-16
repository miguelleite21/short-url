import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from 'src/user/user.entity';
import { AuthService } from 'src/auth/auth.service';

// Mock do bcrypt
vi.mock('bcrypt', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let entityManager: EntityManager;
  let jwtService: JwtService;

  beforeEach(() => {
    entityManager = {
      findOne: vi.fn(),
      create: vi.fn(),
      persistAndFlush: vi.fn(),
    } as any;

    jwtService = {
      sign: vi.fn(),
    } as any; 

    authService = new AuthService(entityManager, jwtService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const hashedPassword = 'hashedPassword';
      const user = { id: 1, email, passwordHash: hashedPassword };

      vi.mocked(entityManager.findOne).mockResolvedValue(null); 
      vi.mocked(bcrypt.hash as any).mockResolvedValue(hashedPassword);
      vi.mocked(entityManager.create).mockReturnValue(user);
      vi.mocked(entityManager.persistAndFlush).mockResolvedValue(undefined);

      const result = await authService.register(email, password);

      expect(entityManager.findOne).toHaveBeenCalledWith(User, { email });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(entityManager.create).toHaveBeenCalledWith(User, {
        email,
        passwordHash: hashedPassword,
      });
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(user);
      expect(result).toBe('User Created Successfully');
    });

    it('should throw BadRequestException if email is already registered', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      vi.mocked(entityManager.findOne as any).mockResolvedValue({ id: 1, email });

      await expect(authService.register(email, password)).rejects.toThrow(BadRequestException);
      expect(entityManager.findOne).toHaveBeenCalledWith(User, { email });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(entityManager.create).not.toHaveBeenCalled();
      expect(entityManager.persistAndFlush).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully and return a token', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const hashedPassword = 'hashedPassword';
      const user = { id: 1, email, passwordHash: hashedPassword };
      const token = 'jwtToken';

      vi.mocked(entityManager.findOne).mockResolvedValue(user);
      vi.mocked(bcrypt.compare as any).mockResolvedValue(true);
      vi.mocked(jwtService.sign).mockReturnValue(token);

      const result = await authService.login(email, password);

      expect(entityManager.findOne).toHaveBeenCalledWith(User, { email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id, email: user.email });
      expect(result).toEqual({ token });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      vi.mocked(entityManager.findOne).mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(UnauthorizedException);
      expect(entityManager.findOne).toHaveBeenCalledWith(User, { email });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const user = { id: 1, email, passwordHash: 'hashedPassword' };
      vi.mocked(entityManager.findOne).mockResolvedValue(user);
      vi.mocked(bcrypt.compare as any).mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow(UnauthorizedException);
      expect(entityManager.findOne).toHaveBeenCalledWith(User, { email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.passwordHash);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});