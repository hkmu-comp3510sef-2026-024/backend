// src/adapters/persistence/prisma/PrismaFineRepository.ts
import { PrismaClient } from '@prisma/client';
import { IFineRepository } from '../../../domain/ports/IFineRepository.js';
import { Fine, FineStatus } from '../../../domain/entities/Fine.js';

export class PrismaFineRepository implements IFineRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: { userId: string; loanId: string; amount: number }): Promise<Fine> {
    const result = await this.prisma.fine.create({ data });
    return {
      ...result,
      amount: Number(result.amount),
      paidAt: result.paidAt ?? undefined,
      paidBy: result.paidBy ?? undefined,
      waivedAt: result.waivedAt ?? undefined,
      waivedBy: result.waivedBy ?? undefined,
      waiveReason: result.waiveReason ?? undefined,
    } as Fine;
  }

  async findById(id: string): Promise<Fine | null> {
    const result = await this.prisma.fine.findUnique({ where: { id } });
    if (!result) return null;
    return {
      ...result,
      amount: Number(result.amount),
      paidAt: result.paidAt ?? undefined,
      paidBy: result.paidBy ?? undefined,
      waivedAt: result.waivedAt ?? undefined,
      waivedBy: result.waivedBy ?? undefined,
      waiveReason: result.waiveReason ?? undefined,
    } as Fine;
  }

  async findByLoanId(loanId: string): Promise<Fine | null> {
    const result = await this.prisma.fine.findUnique({ where: { loanId } });
    if (!result) return null;
    return {
      ...result,
      amount: Number(result.amount),
      paidAt: result.paidAt ?? undefined,
      paidBy: result.paidBy ?? undefined,
      waivedAt: result.waivedAt ?? undefined,
      waivedBy: result.waivedBy ?? undefined,
      waiveReason: result.waiveReason ?? undefined,
    } as Fine;
  }

  async findPaginated(query: {
    status?: FineStatus;
    userId?: string;
    skip: number;
    take: number;
  }): Promise<{ items: Fine[]; total: number }> {
    const where = {
      ...(query.status && { status: query.status }),
      ...(query.userId && { userId: query.userId }),
    };
    const [items, total] = await Promise.all([
      this.prisma.fine.findMany({ where, skip: query.skip, take: query.take }),
      this.prisma.fine.count({ where }),
    ]);
    return {
      items: items.map(
        item =>
          ({
            ...item,
            amount: Number(item.amount),
            paidAt: item.paidAt ?? undefined,
            paidBy: item.paidBy ?? undefined,
            waivedAt: item.waivedAt ?? undefined,
            waivedBy: item.waivedBy ?? undefined,
            waiveReason: item.waiveReason ?? undefined,
          }) as Fine,
      ),
      total,
    };
  }

  async update(
    id: string,
    data: Partial<{
      status: FineStatus;
      paidAt: Date;
      paidBy: string;
      waivedAt: Date;
      waivedBy: string;
      waiveReason: string;
    }>,
  ): Promise<Fine> {
    const result = await this.prisma.fine.update({ where: { id }, data });
    return {
      ...result,
      amount: Number(result.amount),
      paidAt: result.paidAt ?? undefined,
      paidBy: result.paidBy ?? undefined,
      waivedAt: result.waivedAt ?? undefined,
      waivedBy: result.waivedBy ?? undefined,
      waiveReason: result.waiveReason ?? undefined,
    } as Fine;
  }
}
