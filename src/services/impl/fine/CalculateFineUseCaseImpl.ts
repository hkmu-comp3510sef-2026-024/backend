// Caller handles uow.transaction()
import type {
  ICalculateFineUseCase,
  CalculateFineData,
} from '../../../services/interfaces/fine/ICalculateFineUseCase.js';
import type { ILoanRepository } from '../../../domain/ports/ILoanRepository.js';
import type { IFineRepository } from '../../../domain/ports/IFineRepository.js';
import type { IReminderPolicyRepository } from '../../../domain/ports/IReminderPolicyRepository.js';
import type { Fine } from '../../../domain/entities/Fine.js';
import { AppError, ErrorCode } from '../../../middlewares/errorHandler.js';

export class CalculateFineUseCaseImpl implements ICalculateFineUseCase {
  constructor(
    private readonly loanRepo: ILoanRepository,
    private readonly fineRepo: IFineRepository,
    private readonly reminderPolicyRepo: IReminderPolicyRepository,
  ) {}

  async execute(data: CalculateFineData): Promise<Fine | null> {
    // 1. Find loan by ID
    const loan = await this.loanRepo.findById(data.loanId);
    if (!loan) {
      throw new AppError(404, 'Loan not found', ErrorCode.LOAN_NOT_FOUND);
    }
    if (loan.status !== 'ACTIVE') {
      throw new AppError(422, 'Loan is not active', ErrorCode.LOAN_NOT_ACTIVE);
    }

    // 2. Calculate days overdue
    const now = new Date();
    const overdueDays = Math.max(
      0,
      Math.floor((now.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)),
    );

    // 3. Get reminder policy for fine rates
    const policy = await this.reminderPolicyRepo.findActive();
    const graceDays = policy?.graceDays ?? 0;
    const dailyFineRate = policy?.dailyFineAmount ?? 1;
    const maxFine = policy?.maxFineAmount ?? 50;

    // 4. Calculate fine amount = days overdue * daily rate (capped at max)
    const daysToFine = Math.max(0, overdueDays - graceDays);
    const fineAmount = Math.min(daysToFine * dailyFineRate, maxFine);

    if (fineAmount <= 0) {
      return null; // No fine applicable, but not an error
    }

    // 5. Create fine record
    const fine = await this.fineRepo.create({
      userId: loan.userId,
      loanId: loan.id,
      amount: fineAmount,
    });

    return fine;
  }
}
