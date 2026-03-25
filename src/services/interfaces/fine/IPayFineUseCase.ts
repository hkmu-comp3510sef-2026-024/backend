import { Fine } from '../../../domain/entities/Fine.js';

export interface PayFineData {
  fineId: string;
  paidBy: string;
}

export interface IPayFineUseCase {
  execute(data: PayFineData): Promise<Fine>;
}
