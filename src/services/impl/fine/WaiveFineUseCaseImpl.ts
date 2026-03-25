// Caller handles uow.transaction()
import type {
  IWaiveFineUseCase,
  WaiveFineData,
} from '../../../services/interfaces/fine/IWaiveFineUseCase.js';
import type { IFineRepository } from '../../../domain/ports/IFineRepository.js';
import type { Fine } from '../../../domain/entities/Fine.js';
import type { IAuditLogService } from '../../interfaces/auditlog/IAuditLogUseCase.js';
import { AppError, ErrorCode } from '../../../middlewares/errorHandler.js';

export class WaiveFineUseCaseImpl implements IWaiveFineUseCase {
  constructor(
    private readonly fineRepo: IFineRepository,
    private readonly auditLogService: IAuditLogService,
  ) {}

  async execute(data: WaiveFineData): Promise<Fine> {
    const fine = await this.fineRepo.findById(data.fineId);
    if (!fine) {
      throw new AppError(404, 'Fine not found', ErrorCode.NOT_FOUND);
    }
    if (fine.status !== 'UNPAID') {
      throw new AppError(422, 'Fine has already been paid or waived', ErrorCode.VALIDATION_ERROR);
    }
    // Create audit log before update
    await this.auditLogService.createLog({
      operatorId: data.waivedBy,
      action: 'FINE_WAIVED',
      targetType: 'Fine',
      targetId: data.fineId,
      beforeData: { status: fine.status, amount: fine.amount },
      afterData: { status: 'WAIVED', waiveReason: data.waiveReason },
    });
    const updatedFine = await this.fineRepo.update(data.fineId, {
      status: 'WAIVED',
      waivedAt: new Date(),
      waivedBy: data.waivedBy,
      waiveReason: data.waiveReason,
    });
    return updatedFine;
  }
}
