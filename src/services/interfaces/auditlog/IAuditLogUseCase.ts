import { AuditLog } from '../../../domain/entities/AuditLog.js';

export interface SearchAuditLogsQuery {
  operatorId?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

export interface SearchAuditLogsResult {
  items: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateAuditLogData {
  operatorId: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeData?: Record<string, any>;
  afterData?: Record<string, any>;
  ipAddress?: string;
}

export interface IAuditLogService {
  searchLogs(query: SearchAuditLogsQuery): Promise<SearchAuditLogsResult>;
  getLogById(id: string): Promise<AuditLog | null>;
  createLog(data: CreateAuditLogData): Promise<AuditLog>;
}
