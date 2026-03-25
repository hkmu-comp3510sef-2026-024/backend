// Caller handles uow.transaction()
import type {
  IReminderPolicyService,
  UpdatePolicyData,
} from '../../../services/interfaces/reminder-policy/IReminderPolicyService.js';
import type { IReminderPolicyRepository } from '../../../domain/ports/IReminderPolicyRepository.js';
import type { ReminderPolicy } from '../../../domain/entities/ReminderPolicy.js';
import { AppError, ErrorCode } from '../../../middlewares/errorHandler.js';
import type { IAuditLogService } from '../../interfaces/auditlog/IAuditLogUseCase.js';

export class ReminderPolicyServiceImpl implements IReminderPolicyService {
  constructor(
    private readonly reminderPolicyRepo: IReminderPolicyRepository,
    private readonly auditLogService: IAuditLogService,
  ) {}

  async getPolicy(): Promise<ReminderPolicy> {
    const policy = await this.reminderPolicyRepo.findActive();
    if (!policy) {
      throw new AppError(404, 'No active reminder policy found', ErrorCode.NOT_FOUND);
    }
    return policy;
  }

  async updatePolicy(data: UpdatePolicyData, updatedBy: string): Promise<ReminderPolicy> {
    // 1. Fetch existing policy
    const existingPolicy = await this.reminderPolicyRepo.findActive();

    // 2. Perform upsert
    const updatedPolicy = await this.reminderPolicyRepo.upsert({
      ...data,
      updatedBy,
    });

    // 3. Create audit log
    await this.auditLogService.createLog({
      operatorId: updatedBy,
      action: 'REMINDER_POLICY_UPDATE',
      targetType: 'ReminderPolicy',
      targetId: updatedPolicy.id,
      beforeData: existingPolicy
        ? {
            dueDaysBefore: existingPolicy.dueDaysBefore,
            overdueDaysAfter: existingPolicy.overdueDaysAfter,
            dailyFineAmount: existingPolicy.dailyFineAmount,
            maxFineAmount: existingPolicy.maxFineAmount,
            graceDays: existingPolicy.graceDays,
            loanDays: existingPolicy.loanDays,
            reservationHoldDays: existingPolicy.reservationHoldDays,
          }
        : undefined,
      afterData: {
        dueDaysBefore: updatedPolicy.dueDaysBefore,
        overdueDaysAfter: updatedPolicy.overdueDaysAfter,
        dailyFineAmount: updatedPolicy.dailyFineAmount,
        maxFineAmount: updatedPolicy.maxFineAmount,
        graceDays: updatedPolicy.graceDays,
        loanDays: updatedPolicy.loanDays,
        reservationHoldDays: updatedPolicy.reservationHoldDays,
      },
    });

    return updatedPolicy;
  }
}
