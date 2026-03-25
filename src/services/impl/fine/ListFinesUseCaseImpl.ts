import type {
  IListFinesUseCase,
  ListFinesQuery,
  ListFinesResult,
} from '../../../services/interfaces/fine/IListFinesUseCase.js';
import type { IFineRepository } from '../../../domain/ports/IFineRepository.js';

export class ListFinesUseCaseImpl implements IListFinesUseCase {
  constructor(private readonly fineRepo: IFineRepository) {}

  async listFines(query: ListFinesQuery): Promise<ListFinesResult> {
    const { status, userId } = query;
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20));
    const skip = (page - 1) * pageSize;

    const result = await this.fineRepo.findPaginated({
      status,
      userId,
      skip,
      take: pageSize,
    });

    const totalPages = Math.ceil(result.total / pageSize);

    return {
      items: result.items,
      total: result.total,
      page,
      pageSize,
      totalPages,
    };
  }
}
