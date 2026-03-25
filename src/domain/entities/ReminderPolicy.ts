// src/domain/entities/ReminderPolicy.ts
export interface ReminderPolicy {
  id: string;
  dueDaysBefore: number[];
  overdueDaysAfter: number[];
  dailyFineAmount: number;
  maxFineAmount: number;
  graceDays: number;
  loanDays: number;
  reservationHoldDays: number;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
