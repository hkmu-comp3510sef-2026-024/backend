import type {
  IQueryCopyUseCase,
  ListCopiesQuery,
  ListCopiesResult,
} from '../../../services/interfaces/copy/IQueryCopyUseCase.js';
import type { ICopyRepository } from '../../../domain/ports/ICopyRepository.js';
import type { Copy } from '../../../domain/entities/Copy.js';

export class QueryCopyUseCaseImpl implements IQueryCopyUseCase {
  constructor(private readonly copyRepo: ICopyRepository) {}

  async listCopies(query: ListCopiesQuery): Promise<ListCopiesResult> {
    // 1. listCopies: call repository.findPaginated with query params
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20));

    const result = await this.copyRepo.findPaginated({
      bookId: query.bookId,
      status: query.status,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      copies: result.items,
      total: result.total,
      page,
      pageSize,
    };
  }

  async getCopyByBarcode(barcode: string): Promise<Copy | null> {
    // 2. getCopyByBarcode: call repository.findByBarcode
    return this.copyRepo.findByBarcode(barcode);
  }
}
