// src/domain/entities/Copy.ts
export type CopyStatus = 'AVAILABLE' | 'ON_LOAN' | 'MAINTENANCE' | 'LOST' | 'REMOVED';

export interface Copy {
  id: string;
  bookId: string;
  barcode: string;
  location: string;
  status: CopyStatus;
  createdAt: Date;
  updatedAt: Date;
}
