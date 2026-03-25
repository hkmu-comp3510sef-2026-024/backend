// src/domain/ports/IBookRepository.ts
import { Book } from '../entities/Book.js';

export interface IBookRepository {
  findById(id: string): Promise<Book | null>;
  findByIsbn(isbn: string): Promise<Book | null>;
}
