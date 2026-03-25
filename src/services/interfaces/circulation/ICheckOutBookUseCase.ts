import { Loan } from '../../../domain/entities/Loan.js';
import { Copy } from '../../../domain/entities/Copy.js';

export interface CheckOutResult {
  loan: Loan;
  copy: Copy;
}

export interface ICheckOutBookUseCase {
  execute(memberId: string, copyBarcode: string): Promise<CheckOutResult>;
}
