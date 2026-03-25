// src/adapters/persistence/prisma/PrismaAuditLogRepository.ts
import { PrismaClient } from '@prisma/client';
import { IAuditLogRepository } from '../../../domain/ports/IAuditLogRepository.js';
import { AuditLog } from '../../../domain/entities/AuditLog.js';

export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: {
    operatorId: string;
    action: string;
    targetType: string;
    targetId: string;
    beforeData?: Record<string, any>;
    afterData?: Record<string, any>;
    ipAddress?: string;
  }): Promise<AuditLog> {
    const result = await this.prisma.auditLog.create({ data });
    return {
      ...result,
      beforeData: (result.beforeData as Record<string, any>) ?? undefined,
      afterData: (result.afterData as Record<string, any>) ?? undefined,
    } as AuditLog;
  }

  async findById(id: string): Promise<AuditLog | null> {
    const result = await this.prisma.auditLog.findUnique({ where: { id } });
    if (!result) return null;
    return {
      ...result,
      beforeData: (result.beforeData as Record<string, any>) ?? undefined,
      afterData: (result.afterData as Record<string, any>) ?? undefined,
    } as AuditLog;
  }

  async search(query: {
    operatorId?: string;
    action?: string;
    targetType?: string;
    targetId?: string;
    startDate?: Date;
    endDate?: Date;
    skip?: number;
    take?: number;
  }): Promise<{ items: AuditLog[]; total: number }> {
    const where = {
      ...(query.operatorId && { operatorId: query.operatorId }),
      ...(query.action && { action: query.action }),
      ...(query.targetType && { targetType: query.targetType }),
      ...(query.targetId && { targetId: query.targetId }),
      ...((query.startDate || query.endDate) && {
        createdAt: {
          ...(query.startDate && { gte: query.startDate }),
          ...(query.endDate && { lte: query.endDate }),
        },
      }),
    };
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);
    return {
      items: items.map(
        item =>
          ({
            ...item,
            beforeData: (item.beforeData as Record<string, any>) ?? undefined,
            afterData: (item.afterData as Record<string, any>) ?? undefined,
          }) as AuditLog,
      ),
      total,
    };
  }
}
