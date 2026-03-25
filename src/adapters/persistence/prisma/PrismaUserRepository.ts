// src/adapters/persistence/prisma/PrismaUserRepository.ts
import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../../domain/ports/IUserRepository.js';
import { User } from '../../../domain/entities/User.js';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.prisma.user.findUnique({ where: { id } });
    if (!result) return null;
    return {
      ...result,
      phone: result.phone ?? undefined,
      studentId: result.studentId ?? undefined,
      address: result.address ?? undefined,
      membershipStart: result.membershipStart ?? undefined,
      membershipEnd: result.membershipEnd ?? undefined,
      freezeReason: result.freezeReason ?? undefined,
      avatarUrl: result.avatarUrl ?? undefined,
    } as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.prisma.user.findUnique({ where: { email } });
    if (!result) return null;
    return {
      ...result,
      phone: result.phone ?? undefined,
      studentId: result.studentId ?? undefined,
      address: result.address ?? undefined,
      membershipStart: result.membershipStart ?? undefined,
      membershipEnd: result.membershipEnd ?? undefined,
      freezeReason: result.freezeReason ?? undefined,
      avatarUrl: result.avatarUrl ?? undefined,
    } as User;
  }
}
