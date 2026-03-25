// Caller handles uow.transaction()
import type { ICreateCopyUseCase } from '../../../services/interfaces/copy/ICreateCopyUseCase.js';
import type { ICopyRepository } from '../../../domain/ports/ICopyRepository.js';
import type { IBookRepository } from '../../../domain/ports/IBookRepository.js';
import type { Copy } from '../../../domain/entities/Copy.js';
import { AppError, ErrorCode } from '../../../middlewares/errorHandler.js';

export class CreateCopyUseCaseImpl implements ICreateCopyUseCase {
  constructor(
    private readonly copyRepo: ICopyRepository,
    private readonly bookRepo: IBookRepository,
  ) {}

  async execute(data: {
    bookId: string;
    barcode: string;
    location?: string;
    status?: 'AVAILABLE' | 'BORROWED' | 'LOST' | 'PROCESSING';
  }): Promise<Copy> {
    // 1. Verify book exists by ID
    const book = await this.bookRepo.findById(data.bookId);
    if (!book) {
      throw new AppError(404, 'Book not found', ErrorCode.BOOK_NOT_FOUND);
    }
    if (!book.isActive) {
      throw new AppError(422, 'Book is not active', ErrorCode.BOOK_INACTIVE);
    }

    // 2. Create new copy entity
    // Map BORROWED status from interface to ON_LOAN for entity
    let status: 'AVAILABLE' | 'ON_LOAN' | 'MAINTENANCE' | 'LOST' | 'REMOVED' = 'AVAILABLE';
    if (data.status) {
      switch (data.status) {
        case 'BORROWED':
          status = 'ON_LOAN';
          break;
        case 'LOST':
          status = 'LOST';
          break;
        case 'PROCESSING':
          status = 'MAINTENANCE';
          break;
        default:
          status = 'AVAILABLE';
      }
    }

    const copy = await this.copyRepo.create({
      bookId: data.bookId,
      barcode: data.barcode,
      location: data.location ?? 'MAIN Shelves',
      status,
    });

    // 3. Return created copy
    return copy;
  }
}
