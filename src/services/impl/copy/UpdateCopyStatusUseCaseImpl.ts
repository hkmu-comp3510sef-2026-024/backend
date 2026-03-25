import type {
  IUpdateCopyStatusUseCase,
  UpdateCopyStatusData,
} from '../../../services/interfaces/copy/IUpdateCopyStatusUseCase.js';
import type { ICopyRepository } from '../../../domain/ports/ICopyRepository.js';
import type { IReservationRepository } from '../../../domain/ports/IReservationRepository.js';
import type { INotificationRepository } from '../../../domain/ports/INotificationRepository.js';
import type { IReminderPolicyRepository } from '../../../domain/ports/IReminderPolicyRepository.js';
import type { IAuditLogService } from '../../interfaces/auditlog/IAuditLogUseCase.js';
import type { Copy } from '../../../domain/entities/Copy.js';
import { AppError, ErrorCode } from '../../../middlewares/errorHandler.js';

export class UpdateCopyStatusUseCaseImpl implements IUpdateCopyStatusUseCase {
  constructor(
    private readonly copyRepo: ICopyRepository,
    private readonly reservationRepo: IReservationRepository,
    private readonly notificationRepo: INotificationRepository,
    private readonly reminderPolicyRepo: IReminderPolicyRepository,
    private readonly auditLogService: IAuditLogService,
  ) {}

  async execute(data: UpdateCopyStatusData): Promise<Copy> {
    // Note: caller handles transaction if needed.
    // 1. Verify copy exists
    const copy = await this.copyRepo.findById(data.copyId);
    if (!copy) {
      throw new AppError(404, 'Copy not found', ErrorCode.COPY_NOT_FOUND);
    }

    // 2. Create audit log before data
    await this.auditLogService.createLog({
      operatorId: data.operatorId,
      action: 'COPY_STATUS_UPDATE',
      targetType: 'Copy',
      targetId: data.copyId,
      beforeData: { status: copy.status },
      afterData: { status: data.newStatus },
    });

    // 3. Update copy status
    const updatedCopy = await this.copyRepo.update(data.copyId, {
      status: data.newStatus,
    });

    // 4. Advance reservation queue if copy is now available
    // TODO: Consider using Event-Driven design here:
    if (data.newStatus === 'AVAILABLE') {
      const nextReservation = await this.reservationRepo.findQueuedByBookId(copy.bookId);
      if (nextReservation) {
        const policy = await this.reminderPolicyRepo.findActive();
        const holdDays = policy?.reservationHoldDays ?? 3;
        const pickupDeadline = new Date();
        pickupDeadline.setDate(pickupDeadline.getDate() + holdDays);

        await this.reservationRepo.update(nextReservation.id, {
          status: 'READY_FOR_PICKUP',
          pickupDeadline,
        });

        await this.notificationRepo.create({
          userId: nextReservation.userId,
          type: 'RESERVATION_READY',
          title: 'Reserved book available',
          content: `Your reserved book is ready for pickup. Please collect it by ${pickupDeadline.toLocaleDateString()}.`,
          reservationId: nextReservation.id,
        });
      }
    }

    return updatedCopy;
  }
}
