// src/domain/entities/AuditLog.ts
export interface AuditLog {
  id: string;
  operatorId: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeData?: Record<string, any>;
  afterData?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}
