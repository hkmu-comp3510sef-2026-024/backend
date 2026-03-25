// src/domain/ports/ICopyRepository.ts
import { Copy, CopyStatus } from '../entities/Copy.js';

export interface ICopyRepository {
  create(data: {
    bookId: string;
    barcode: string;
    location: string;
    status?: CopyStatus;
  }): Promise<Copy>;
  findById(id: string): Promise<Copy | null>;
  findByBarcode(barcode: string): Promise<Copy | null>;
  findPaginated(query: {
    bookId?: string;
    status?: CopyStatus;
    skip: number;
    take: number;
  }): Promise<{ items: Copy[]; total: number }>;
  update(id: string, data: Partial<{ location: string; status: CopyStatus }>): Promise<Copy>;
  delete(id: string): Promise<void>;
}
