// Service interfaces barrel export

export type { ILogger, LoggerOptions, LogMeta } from './logger/logger.service.interface.js';
export { LogLevel } from './logger/logger.service.interface.js';
export type { IDatabase } from './database/database.interface.js';

// Copy Service
export type { ICreateCopyUseCase, CreateCopyData } from './copy/ICreateCopyUseCase.js';
export type {
  IQueryCopyUseCase,
  ListCopiesQuery as QueryCopiesQuery,
  ListCopiesResult as QueryCopiesResult,
} from './copy/IQueryCopyUseCase.js';
export type { IUpdateCopyStatusUseCase } from './copy/IUpdateCopyStatusUseCase.js';

// Circulation Service
export type { ICheckOutBookUseCase, CheckOutResult } from './circulation/ICheckOutBookUseCase.js';
export type {
  IReturnBookUseCase,
  ReturnCondition as ReturnBookCondition,
  ReturnResult as ReturnBookResult,
} from './circulation/IReturnBookUseCase.js';
export type {
  ILookupCopyUseCase,
  LookupResult as LookupCopyResult,
} from './circulation/ILookupCopyUseCase.js';

// Fine Service
export type { ICalculateFineUseCase, CalculateFineData } from './fine/ICalculateFineUseCase.js';
export type { IPayFineUseCase, PayFineData } from './fine/IPayFineUseCase.js';
export type {
  IListFinesUseCase,
  ListFinesQuery,
  ListFinesResult,
} from './fine/IListFinesUseCase.js';
export type { IWaiveFineUseCase, WaiveFineData } from './fine/IWaiveFineUseCase.js';

// Audit Log Service
export type {
  IAuditLogService,
  SearchAuditLogsQuery,
  SearchAuditLogsResult,
  CreateAuditLogData,
} from './auditlog/IAuditLogUseCase.js';

// Reminder Policy Service
export type { IReminderPolicyService } from './reminder-policy/IReminderPolicyService.js';
