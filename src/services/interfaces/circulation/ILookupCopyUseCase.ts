import { Copy } from '../../../domain/entities/Copy.js';
import { Loan } from '../../../domain/entities/Loan.js';
import { Book } from '../../../domain/entities/Book.js';

export interface LookupResult {
  copy: Copy;
  book: Book;
  loan?: Loan | null;
}

export interface ILookupCopyUseCase {
  execute(copyBarcode: string): Promise<LookupResult>;
}
