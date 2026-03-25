// Caller handles uow.transaction()
import type {
  ICheckOutBookUseCase,
  CheckOutResult,
} from '../../../services/interfaces/circulation/ICheckOutBookUseCase.js';
import type { IUserRepository } from '../../../domain/ports/IUserRepository.js';
import type { ICopyRepository } from '../../../domain/ports/ICopyRepository.js';
import type { ILoanRepository } from '../../../domain/ports/ILoanRepository.js';
import type { IReminderPolicyRepository } from '../../../domain/ports/IReminderPolicyRepository.js';
import type { IReservationRepository } from '../../../domain/ports/IReservationRepository.js';
import { AppError, ErrorCode } from '../../../middlewares/errorHandler.js';

export class CheckOutBookUseCaseImpl implements ICheckOutBookUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly copyRepo: ICopyRepository,
    private readonly loanRepo: ILoanRepository,
    private readonly reservationRepo: IReservationRepository,
    private readonly reminderPolicyRepo: IReminderPolicyRepository,
  ) {}

  async execute(memberId: string, copyBarcode: string): Promise<CheckOutResult> {
    // 1. Find member by ID - verify exists and is active
    const member = await this.userRepo.findById(memberId);
    if (!member) {
      throw new AppError(404, 'Member not found', ErrorCode.USER_NOT_FOUND);
    }
    if (member.status !== 'ACTIVE') {
      if (member.status === 'PENDING') {
        throw new AppError(422, 'Member account is pending approval', ErrorCode.MEMBER_NOT_ACTIVE);
      }
      if (member.status === 'FROZEN') {
        throw new AppError(422, 'Member account is frozen', ErrorCode.MEMBER_IS_FROZEN);
      }
      throw new AppError(422, 'Member account is not active', ErrorCode.MEMBER_NOT_ACTIVE);
    }

    // 2. Find copy by barcode - verify exists and is available
    const copy = await this.copyRepo.findByBarcode(copyBarcode);
    if (!copy) {
      throw new AppError(404, 'Copy not found', ErrorCode.COPY_NOT_FOUND);
    }
    if (copy.status !== 'AVAILABLE') {
      throw new AppError(422, 'Copy is not available', ErrorCode.COPY_NOT_AVAILABLE);
    }

    // 3. Check if member has a READY_FOR_PICKUP reservation for this book
    const reservation = await this.reservationRepo.findReadyByUserId(memberId);
    const reservationId =
      reservation && reservation.bookId === copy.bookId ? reservation.id : undefined;

    // 4. Check if member has overdue loans (business rule)
    const memberLoans = await this.loanRepo.findByUserId(memberId);
    const hasOverdueLoans = memberLoans.some(
      loan => loan.status === 'ACTIVE' && loan.dueDate < new Date(),
    );
    if (hasOverdueLoans) {
      throw new AppError(422, 'Member has overdue loans', ErrorCode.MEMBER_HAS_OVERDUE_LOANS);
    }

    // 5. Check if member already has this copy checked out
    const activeLoanOnCopy = memberLoans.some(
      loan => loan.status === 'ACTIVE' && loan.copyId === copy.id,
    );
    if (activeLoanOnCopy) {
      throw new AppError(
        422,
        'Member already has this copy checked out',
        ErrorCode.COPY_NOT_AVAILABLE,
      );
    }

    // 6. Create loan with due date based on reminder policy
    const policy = await this.reminderPolicyRepo.findActive();
    const loanDays = policy?.loanDays ?? 14;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + loanDays);

    const loan = await this.loanRepo.create({
      userId: memberId,
      copyId: copy.id,
      bookId: copy.bookId,
      dueDate,
      reservationId,
    });

    // 6b. Mark reservation as completed if it was linked
    if (reservationId) {
      await this.reservationRepo.update(reservationId, {
        status: 'COMPLETED',
      });
    }

    // 7. Update copy status to BORROWED (ON_LOAN)
    const updatedCopy = await this.copyRepo.update(copy.id, {
      status: 'ON_LOAN',
    });

    return { loan, copy: updatedCopy };
  }
}
