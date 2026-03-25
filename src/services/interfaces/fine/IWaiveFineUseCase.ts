import { Fine } from '../../../domain/entities/Fine.js';

export interface WaiveFineData {
  fineId: string;
  waivedBy: string;
  waiveReason: string;
}

export interface IWaiveFineUseCase {
  execute(data: WaiveFineData): Promise<Fine>;
}
