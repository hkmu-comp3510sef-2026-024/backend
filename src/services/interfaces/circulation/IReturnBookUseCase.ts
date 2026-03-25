import { Loan } from '../../../domain/entities/Loan.js';
import { Fine } from '../../../domain/entities/Fine.js';

export interface ReturnCondition {
  condition: 'GOOD' | 'DAMAGED' | 'LOST';
  notes?: string;
}

export interface ReturnResult {
  loan: Loan;
  fine?: Fine;
}

export interface IReturnBookUseCase {
  execute(loanId: string, condition: ReturnCondition): Promise<ReturnResult>;
}
