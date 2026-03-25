import { Copy } from '../../../domain/entities/Copy.js';

export interface CreateCopyData {
  bookId: string;
  barcode: string;
  location?: string;
  status?: 'AVAILABLE' | 'BORROWED' | 'LOST' | 'PROCESSING';
}

export interface ICreateCopyUseCase {
  execute(data: CreateCopyData): Promise<Copy>;
}
