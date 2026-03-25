// Caller handles uow.transaction()
import type {
  IPayFineUseCase,
  PayFineData,
} from '../../../services/interfaces/fine/IPayFineUseCase.js';
import type { IFineRepository } from '../../../domain/ports/IFineRepository.js';
import type { Fine } from '../../../domain/entities/Fine.js';
import type { IAuditLogService } from '../../interfaces/auditlog/IAuditLogUseCase.js';
import { AppError, ErrorCode } from '../../../middlewares/errorHandler.js';

export class PayFineUseCaseImpl implements IPayFineUseCase {
  constructor(
    private readonly fineRepo: IFineRepository,
    private readonly auditLogService: IAuditLogService,
  ) {}

  async execute(data: PayFineData): Promise<Fine> {
    // 1. Find fine by ID
    const fine = await this.fineRepo.findById(data.fineId);
    if (!fine) {
      throw new AppError(404, 'Fine not found', ErrorCode.FINE_NOT_FOUND);
    }

    // 2. Verify fine is unpaid
    if (fine.status === 'PAID') {
      throw new AppError(422, 'Fine already paid', ErrorCode.FINE_ALREADY_PAID);
    }
    if (fine.status === 'WAIVED') {
      throw new AppError(422, 'Fine already waived', ErrorCode.FINE_ALREADY_WAIVED);
    }

    // 3. Create audit log before update
    await this.auditLogService.createLog({
      operatorId: data.paidBy,
      action: 'FINE_PAID',
      targetType: 'Fine',
      targetId: data.fineId,
      beforeData: { status: fine.status, amount: fine.amount },
      afterData: { status: 'PAID' },
    });

    // 4. Update fine status to PAID
    const updatedFine = await this.fineRepo.update(data.fineId, {
      status: 'PAID',
      paidAt: new Date(),
      paidBy: data.paidBy,
    });

    return updatedFine;
  }
}
