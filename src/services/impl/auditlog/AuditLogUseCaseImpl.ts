import type { AuditLog } from '../../../domain/entities/AuditLog.js';
import type {
  IAuditLogService,
  SearchAuditLogsQuery,
  SearchAuditLogsResult,
  CreateAuditLogData,
} from '../../interfaces/auditlog/IAuditLogUseCase.js';
import type { IAuditLogRepository } from '../../../domain/ports/IAuditLogRepository.js';

export class AuditLogService implements IAuditLogService {
  constructor(private readonly auditLogRepo: IAuditLogRepository) {}

  async searchLogs(query: SearchAuditLogsQuery): Promise<SearchAuditLogsResult> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20));

    const result = await this.auditLogRepo.search({
      operatorId: query.operatorId,
      action: query.action,
      targetType: query.targetType,
      targetId: query.targetId,
      startDate: query.startDate,
      endDate: query.endDate,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items: result.items,
      total: result.total,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize),
    };
  }

  async getLogById(id: string): Promise<AuditLog | null> {
    return this.auditLogRepo.findById(id);
  }

  async createLog(data: CreateAuditLogData): Promise<AuditLog> {
    return this.auditLogRepo.create(data);
  }
}
