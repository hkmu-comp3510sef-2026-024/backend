// src/domain/entities/Loan.ts
export type LoanStatus = 'ACTIVE' | 'RETURNED';

export interface Loan {
  id: string;
  userId: string;
  copyId: string;
  bookId: string;
  status: LoanStatus;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt?: Date;
  renewCount: number;
  maxRenews: number;
  reservationId?: string;
  createdAt: Date;
  updatedAt: Date;
}
