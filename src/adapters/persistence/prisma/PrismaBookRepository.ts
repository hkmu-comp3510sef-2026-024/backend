// src/adapters/persistence/prisma/PrismaBookRepository.ts
import { PrismaClient } from '@prisma/client';
import { IBookRepository } from '../../../domain/ports/IBookRepository.js';
import { Book } from '../../../domain/entities/Book.js';

export class PrismaBookRepository implements IBookRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Book | null> {
    const result = await this.prisma.book.findUnique({ where: { id } });
    if (!result) return null;
    return {
      ...result,
      description: result.description ?? undefined,
      publishYear: result.publishYear ?? undefined,
      coverUrl: result.coverUrl ?? undefined,
    } as Book;
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    const result = await this.prisma.book.findUnique({ where: { isbn } });
    if (!result) return null;
    return {
      ...result,
      description: result.description ?? undefined,
      publishYear: result.publishYear ?? undefined,
      coverUrl: result.coverUrl ?? undefined,
    } as Book;
  }
}
