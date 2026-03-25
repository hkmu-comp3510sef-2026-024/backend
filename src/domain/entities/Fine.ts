// src/domain/entities/Fine.ts
export type FineStatus = 'UNPAID' | 'PAID' | 'WAIVED';

export interface Fine {
  id: string;
  userId: string;
  loanId: string;
  amount: number;
  status: FineStatus;
  paidAt?: Date;
  paidBy?: string;
  waivedAt?: Date;
  waivedBy?: string;
  waiveReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
