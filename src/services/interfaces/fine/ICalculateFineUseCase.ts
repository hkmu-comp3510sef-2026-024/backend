import { Fine } from '../../../domain/entities/Fine.js';

export interface CalculateFineData {
  loanId: string;
}

export interface ICalculateFineUseCase {
  execute(data: CalculateFineData): Promise<Fine | null>;
}
