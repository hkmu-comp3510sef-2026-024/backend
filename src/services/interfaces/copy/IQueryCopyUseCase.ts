import { Copy, CopyStatus } from '../../../domain/entities/Copy.js';

export interface ListCopiesQuery {
  page?: number;
  pageSize?: number;
  bookId?: string;
  status?: CopyStatus;
}

export interface ListCopiesResult {
  copies: Copy[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IQueryCopyUseCase {
  listCopies(query: ListCopiesQuery): Promise<ListCopiesResult>;
  getCopyByBarcode(barcode: string): Promise<Copy | null>;
}
