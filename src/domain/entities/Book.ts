// src/domain/entities/Book.ts
export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  description?: string;
  publishYear?: number;
  coverUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
