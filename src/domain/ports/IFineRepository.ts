// src/domain/ports/IFineRepository.ts
import { Fine, FineStatus } from '../entities/Fine.js';

export interface IFineRepository {
  create(data: { userId: string; loanId: string; amount: number }): Promise<Fine>;
  findById(id: string): Promise<Fine | null>;
  findByLoanId(loanId: string): Promise<Fine | null>;
  findPaginated(query: {
    status?: FineStatus;
    userId?: string;
    skip: number;
    take: number;
  }): Promise<{ items: Fine[]; total: number }>;
  update(
    id: string,
    data: Partial<{
      status: string;
      paidAt: Date;
      paidBy: string;
      waivedAt: Date;
      waivedBy: string;
      waiveReason: string;
    }>,
  ): Promise<Fine>;
}
