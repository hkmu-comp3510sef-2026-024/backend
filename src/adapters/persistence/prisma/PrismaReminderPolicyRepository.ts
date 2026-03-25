// src/adapters/persistence/prisma/PrismaReminderPolicyRepository.ts
import { PrismaClient } from '@prisma/client';
import { IReminderPolicyRepository } from '../../../domain/ports/IReminderPolicyRepository.js';
import { ReminderPolicy } from '../../../domain/entities/ReminderPolicy.js';

export class PrismaReminderPolicyRepository implements IReminderPolicyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findActive(): Promise<ReminderPolicy | null> {
    const policies = await this.prisma.reminderPolicy.findMany({
      take: 1,
      orderBy: { createdAt: 'desc' },
    });
    if (!policies[0]) return null;
    const policy = policies[0];
    return {
      ...policy,
      dailyFineAmount: Number(policy.dailyFineAmount),
      maxFineAmount: Number(policy.maxFineAmount),
      loanDays: policy.loanDays,
    };
  }

  async upsert(data: {
    dueDaysBefore?: number[];
    overdueDaysAfter?: number[];
    dailyFineAmount?: number;
    maxFineAmount?: number;
    graceDays?: number;
    loanDays?: number;
    reservationHoldDays?: number;
    updatedBy: string;
  }): Promise<ReminderPolicy> {
    const activePolicy = await this.prisma.reminderPolicy.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let result;
    if (activePolicy) {
      result = await this.prisma.reminderPolicy.update({
        where: { id: activePolicy.id },
        data,
      });
    } else {
      result = await this.prisma.reminderPolicy.create({ data });
    }

    return {
      ...result,
      dailyFineAmount: Number(result.dailyFineAmount),
      maxFineAmount: Number(result.maxFineAmount),
      loanDays: result.loanDays,
    };
  }
}
