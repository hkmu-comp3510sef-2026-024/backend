// src/domain/ports/ILoanRepository.ts
import { Loan } from '../entities/Loan.js';

export interface ILoanRepository {
  create(data: {
    userId: string;
    copyId: string;
    bookId: string;
    dueDate: Date;
    reservationId?: string;
  }): Promise<Loan>;
  findById(id: string): Promise<Loan | null>;
  findActiveByCopyId(copyId: string): Promise<Loan | null>;
  findByUserId(userId: string): Promise<Loan[]>;
  update(
    id: string,
    data: Partial<{ status: string; returnedAt: Date; dueDate: Date; renewCount: number }>,
  ): Promise<Loan>;
}
