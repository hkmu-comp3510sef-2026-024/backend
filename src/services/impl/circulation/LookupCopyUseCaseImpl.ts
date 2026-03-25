import type {
  ILookupCopyUseCase,
  LookupResult,
} from '../../../services/interfaces/circulation/ILookupCopyUseCase.js';
import type { ICopyRepository } from '../../../domain/ports/ICopyRepository.js';
import type { ILoanRepository } from '../../../domain/ports/ILoanRepository.js';
import type { IBookRepository } from '../../../domain/ports/IBookRepository.js';
import { AppError, ErrorCode } from '../../../middlewares/errorHandler.js';

export class LookupCopyUseCaseImpl implements ILookupCopyUseCase {
  constructor(
    private readonly copyRepo: ICopyRepository,
    private readonly loanRepo: ILoanRepository,
    private readonly bookRepo: IBookRepository,
  ) {}

  async execute(copyBarcode: string): Promise<LookupResult> {
    // 1. Find copy by barcode
    const copy = await this.copyRepo.findByBarcode(copyBarcode);

    // 2. If not found, throw error
    if (!copy) {
      throw new AppError(404, 'Copy not found', ErrorCode.COPY_NOT_FOUND);
    }

    // 3. Find associated book via copy.bookId
    const book = await this.bookRepo.findById(copy.bookId);
    if (!book) {
      throw new AppError(404, 'Book not found', ErrorCode.BOOK_NOT_FOUND);
    }

    // 4. If loan is active for this copy, include it in result
    const activeLoan = await this.loanRepo.findActiveByCopyId(copy.id);

    // 5. Return LookupResult
    return {
      copy,
      book,
      loan: activeLoan,
    };
  }
}
