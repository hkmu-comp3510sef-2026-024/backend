// Caller handles uow.transaction()
import type {
  IReturnBookUseCase,
  ReturnCondition,
  ReturnResult,
} from '../../../services/interfaces/circulation/IReturnBookUseCase.js';
import type { ILoanRepository } from '../../../domain/ports/ILoanRepository.js';
import type { ICopyRepository } from '../../../domain/ports/ICopyRepository.js';
import type { IFineRepository } from '../../../domain/ports/IFineRepository.js';
import type { IReminderPolicyRepository } from '../../../domain/ports/IReminderPolicyRepository.js';
import type { IUpdateCopyStatusUseCase } from '../../interfaces/copy/IUpdateCopyStatusUseCase.js';
import type { Fine } from '../../../domain/entities/Fine.js';
import { AppError, ErrorCode } from '../../../middlewares/errorHandler.js';
import { differenceInDays } from 'date-fns';

export class ReturnBookUseCaseImpl implements IReturnBookUseCase {
  constructor(
    private readonly loanRepo: ILoanRepository,
    private readonly copyRepo: ICopyRepository,
    private readonly fineRepo: IFineRepository,
    private readonly reminderPolicyRepo: IReminderPolicyRepository,
    private readonly updateCopyStatusUseCase: IUpdateCopyStatusUseCase,
  ) {}

  async execute(loanId: string, condition: ReturnCondition): Promise<ReturnResult> {
    // 1. Find loan by ID - verify exists and is active
    const loan = await this.loanRepo.findById(loanId);
    if (!loan) {
      throw new AppError(404, 'Loan not found', ErrorCode.LOAN_NOT_FOUND);
    }
    if (loan.status !== 'ACTIVE') {
      throw new AppError(422, 'Loan is not active', ErrorCode.LOAN_NOT_ACTIVE);
    }

    // 2. Get the copy to find its bookId (needed for reservation queue)
    const copy = await this.copyRepo.findById(loan.copyId);
    if (!copy) {
      throw new AppError(404, 'Copy not found', ErrorCode.COPY_NOT_FOUND);
    }

    // 3. Calculate if overdue based on dueDate vs return date
    const now = new Date();
    const overdueDays = Math.max(0, differenceInDays(now, loan.dueDate));

    // 4. If overdue, calculate fine amount based on reminder policy
    let fine: Fine | undefined;
    const policy = await this.reminderPolicyRepo.findActive();
    const effectiveOverdueDays = Math.max(0, overdueDays - (policy?.graceDays ?? 0));
    if (effectiveOverdueDays > 0) {
      const fineAmount = Math.min(
        effectiveOverdueDays * (policy?.dailyFineAmount ?? 1),
        policy?.maxFineAmount ?? 50,
      );
      fine = await this.fineRepo.create({
        userId: loan.userId,
        loanId: loan.id,
        amount: fineAmount,
      });
    }

    // 5. Update loan status to RETURNED, set returnedAt
    const updatedLoan = await this.loanRepo.update(loan.id, {
      status: 'RETURNED',
      returnedAt: now,
    });

    // 6. Update copy status based on return condition - delegates to UpdateCopyStatusUseCase
    // to properly handle reservation queue advancement when copy becomes AVAILABLE
    let newCopyStatus: 'AVAILABLE' | 'ON_LOAN' | 'MAINTENANCE' | 'LOST' | 'REMOVED';
    switch (condition.condition) {
      case 'DAMAGED':
        newCopyStatus = 'MAINTENANCE';
        break;
      case 'LOST':
        newCopyStatus = 'LOST';
        break;
      default:
        newCopyStatus = 'AVAILABLE';
    }

    // Use UpdateCopyStatusUseCase to handle status change + reservation queue
    await this.updateCopyStatusUseCase.execute({
      copyId: loan.copyId,
      newStatus: newCopyStatus,
      operatorId: loan.userId, // The borrower returning the book
    });

    return { loan: updatedLoan, fine };
  }
}
