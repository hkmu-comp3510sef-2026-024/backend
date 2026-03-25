// src/adapters/persistence/prisma/PrismaUnitOfWork.ts
import { prisma } from './PrismaClient.js';
import { IUnitOfWork } from '../../../domain/ports/IUnitOfWork.js';

export class PrismaUnitOfWork implements IUnitOfWork {
  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    return prisma.$transaction(fn);
  }
}
