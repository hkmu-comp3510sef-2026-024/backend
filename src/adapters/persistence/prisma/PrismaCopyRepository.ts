// src/adapters/persistence/prisma/PrismaCopyRepository.ts
import { PrismaClient } from '@prisma/client';
import { ICopyRepository } from '../../../domain/ports/ICopyRepository.js';
import { Copy, CopyStatus } from '../../../domain/entities/Copy.js';

export class PrismaCopyRepository implements ICopyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: {
    bookId: string;
    barcode: string;
    location: string;
    status?: CopyStatus;
  }): Promise<Copy> {
    return this.prisma.copy.create({ data });
  }

  async findById(id: string): Promise<Copy | null> {
    return this.prisma.copy.findUnique({ where: { id } });
  }

  async findByBarcode(barcode: string): Promise<Copy | null> {
    return this.prisma.copy.findUnique({ where: { barcode } });
  }

  async findPaginated(query: {
    bookId?: string;
    status?: CopyStatus;
    skip: number;
    take: number;
  }): Promise<{ items: Copy[]; total: number }> {
    const where = {
      ...(query.bookId && { bookId: query.bookId }),
      ...(query.status && { status: query.status }),
    };
    const [items, total] = await Promise.all([
      this.prisma.copy.findMany({ where, skip: query.skip, take: query.take }),
      this.prisma.copy.count({ where }),
    ]);
    return { items, total };
  }

  async update(id: string, data: Partial<{ location: string; status: CopyStatus }>): Promise<Copy> {
    return this.prisma.copy.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.copy.delete({ where: { id } });
  }
}
