// src/domain/ports/IReminderPolicyRepository.ts
import { ReminderPolicy } from '../entities/ReminderPolicy.js';

export interface IReminderPolicyRepository {
  findActive(): Promise<ReminderPolicy | null>;
  upsert(data: {
    dueDaysBefore?: number[];
    overdueDaysAfter?: number[];
    dailyFineAmount?: number;
    maxFineAmount?: number;
    graceDays?: number;
    loanDays?: number;
    reservationHoldDays?: number;
    updatedBy: string;
  }): Promise<ReminderPolicy>;
}
