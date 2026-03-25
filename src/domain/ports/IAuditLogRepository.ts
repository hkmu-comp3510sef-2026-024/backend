// src/domain/ports/IAuditLogRepository.ts
import { AuditLog } from '../entities/AuditLog.js';

export interface IAuditLogRepository {
  create(data: {
    operatorId: string;
    action: string;
    targetType: string;
    targetId: string;
    beforeData?: Record<string, any>;
    afterData?: Record<string, any>;
    ipAddress?: string;
  }): Promise<AuditLog>;
  findById(id: string): Promise<AuditLog | null>;
  search(query: {
    operatorId?: string;
    action?: string;
    targetType?: string;
    targetId?: string;
    startDate?: Date;
    endDate?: Date;
    skip?: number;
    take?: number;
  }): Promise<{ items: AuditLog[]; total: number }>;
}
