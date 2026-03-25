// src/adapters/persistence/prisma/PrismaLoanRepository.ts
import { PrismaClient } from '@prisma/client';
import { ILoanRepository } from '../../../domain/ports/ILoanRepository.js';
import { Loan, LoanStatus } from '../../../domain/entities/Loan.js';

export class PrismaLoanRepository implements ILoanRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: {
    userId: string;
    copyId: string;
    bookId: string;
    dueDate: Date;
    reservationId?: string;
  }): Promise<Loan> {
    const result = await this.prisma.loan.create({ data });
    return {
      ...result,
      createdAt: result.borrowedAt,
      updatedAt: result.borrowedAt,
      returnedAt: result.returnedAt ?? undefined,
      reservationId: result.reservationId ?? undefined,
    } as Loan;
  }

  async findById(id: string): Promise<Loan | null> {
    const result = await this.prisma.loan.findUnique({ where: { id } });
    if (!result) return null;
    return {
      ...result,
      createdAt: result.borrowedAt,
      updatedAt: result.borrowedAt,
      returnedAt: result.returnedAt ?? undefined,
      reservationId: result.reservationId ?? undefined,
    } as Loan;
  }

  async findActiveByCopyId(copyId: string): Promise<Loan | null> {
    const result = await this.prisma.loan.findFirst({
      where: { copyId, status: 'ACTIVE' },
    });
    if (!result) return null;
    return {
      ...result,
      createdAt: result.borrowedAt,
      updatedAt: result.borrowedAt,
      returnedAt: result.returnedAt ?? undefined,
      reservationId: result.reservationId ?? undefined,
    } as Loan;
  }

  async findByUserId(userId: string): Promise<Loan[]> {
    const results = await this.prisma.loan.findMany({ where: { userId } });
    return results.map(
      r =>
        ({
          ...r,
          createdAt: r.borrowedAt,
          updatedAt: r.borrowedAt,
          returnedAt: r.returnedAt ?? undefined,
          reservationId: r.reservationId ?? undefined,
        }) as Loan,
    );
  }

  async update(
    id: string,
    data: Partial<{ status: LoanStatus; returnedAt: Date; dueDate: Date; renewCount: number }>,
  ): Promise<Loan> {
    const result = await this.prisma.loan.update({ where: { id }, data });
    return {
      ...result,
      createdAt: result.borrowedAt,
      updatedAt: result.borrowedAt,
      returnedAt: result.returnedAt ?? undefined,
      reservationId: result.reservationId ?? undefined,
    } as Loan;
  }
}
