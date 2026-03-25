import { ReminderPolicy } from '../../../domain/entities/ReminderPolicy.js';

export interface UpdatePolicyData {
  dueDaysBefore?: number[];
  overdueDaysAfter?: number[];
  dailyFineAmount?: number;
  maxFineAmount?: number;
  graceDays?: number;
  loanDays?: number;
  reservationHoldDays?: number;
}

export interface IReminderPolicyService {
  getPolicy(): Promise<ReminderPolicy>;
  updatePolicy(data: UpdatePolicyData, updatedBy: string): Promise<ReminderPolicy>;
}
