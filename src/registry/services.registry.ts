// Services registry - wires all use case service singletons with constructor injection
import type { ICheckOutBookUseCase } from '../services/interfaces/circulation/ICheckOutBookUseCase.js';
import type { IReturnBookUseCase } from '../services/interfaces/circulation/IReturnBookUseCase.js';
import type { ILookupCopyUseCase } from '../services/interfaces/circulation/ILookupCopyUseCase.js';
import type { ICreateCopyUseCase } from '../services/interfaces/copy/ICreateCopyUseCase.js';
import type { IQueryCopyUseCase } from '../services/interfaces/copy/IQueryCopyUseCase.js';
import type { IUpdateCopyStatusUseCase } from '../services/interfaces/copy/IUpdateCopyStatusUseCase.js';
import type { ICalculateFineUseCase } from '../services/interfaces/fine/ICalculateFineUseCase.js';
import type { IListFinesUseCase } from '../services/interfaces/fine/IListFinesUseCase.js';
import type { IPayFineUseCase } from '../services/interfaces/fine/IPayFineUseCase.js';
import type { IWaiveFineUseCase } from '../services/interfaces/fine/IWaiveFineUseCase.js';
import type { IReminderPolicyService } from '../services/interfaces/reminder-policy/IReminderPolicyService.js';

import { CheckOutBookUseCaseImpl } from '../services/impl/circulation/CheckOutBookUseCaseImpl.js';
import { ReturnBookUseCaseImpl } from '../services/impl/circulation/ReturnBookUseCaseImpl.js';
import { LookupCopyUseCaseImpl } from '../services/impl/circulation/LookupCopyUseCaseImpl.js';
import { CreateCopyUseCaseImpl } from '../services/impl/copy/CreateCopyUseCaseImpl.js';
import { QueryCopyUseCaseImpl } from '../services/impl/copy/QueryCopyUseCaseImpl.js';
import { UpdateCopyStatusUseCaseImpl } from '../services/impl/copy/UpdateCopyStatusUseCaseImpl.js';
import { CalculateFineUseCaseImpl } from '../services/impl/fine/CalculateFineUseCaseImpl.js';
import { ListFinesUseCaseImpl } from '../services/impl/fine/ListFinesUseCaseImpl.js';
import { PayFineUseCaseImpl } from '../services/impl/fine/PayFineUseCaseImpl.js';
import { WaiveFineUseCaseImpl } from '../services/impl/fine/WaiveFineUseCaseImpl.js';
import { ReminderPolicyServiceImpl } from '../services/impl/reminder-policy/index.js';

// Import AuditLogService class (refactored to use dependency injection)
import { AuditLogService } from '../services/impl/auditlog/AuditLogUseCaseImpl.js';

import type { IAuditLogService } from '../services/interfaces/auditlog/IAuditLogUseCase.js';

import {
  userRepository,
  bookRepository,
  copyRepository,
  loanRepository,
  fineRepository,
  reservationRepository,
  notificationRepository,
  auditLogRepository,
  reminderPolicyRepository,
} from './repositories.registry.js';

// Properly wired AuditLogService instance using dependency injection
export const auditLogService: IAuditLogService = new AuditLogService(auditLogRepository);

// Define updateCopyStatusUseCase first since returnBookUseCase depends on it
export const updateCopyStatusUseCase: IUpdateCopyStatusUseCase = new UpdateCopyStatusUseCaseImpl(
  copyRepository,
  reservationRepository,
  notificationRepository,
  reminderPolicyRepository,
  auditLogService,
);

// New use case singletons (direct exports)
export const checkOutBookUseCase: ICheckOutBookUseCase = new CheckOutBookUseCaseImpl(
  userRepository,
  copyRepository,
  loanRepository,
  reservationRepository,
  reminderPolicyRepository,
);

export const returnBookUseCase: IReturnBookUseCase = new ReturnBookUseCaseImpl(
  loanRepository,
  copyRepository,
  fineRepository,
  reminderPolicyRepository,
  updateCopyStatusUseCase,
);

export const lookupCopyUseCase: ILookupCopyUseCase = new LookupCopyUseCaseImpl(
  copyRepository,
  loanRepository,
  bookRepository,
);

export const createCopyUseCase: ICreateCopyUseCase = new CreateCopyUseCaseImpl(
  copyRepository,
  bookRepository,
);

export const queryCopyUseCase: IQueryCopyUseCase = new QueryCopyUseCaseImpl(copyRepository);

export const calculateFineUseCase: ICalculateFineUseCase = new CalculateFineUseCaseImpl(
  loanRepository,
  fineRepository,
  reminderPolicyRepository,
);

export const payFineUseCase: IPayFineUseCase = new PayFineUseCaseImpl(
  fineRepository,
  auditLogService,
);

export const listFinesUseCase: IListFinesUseCase = new ListFinesUseCaseImpl(fineRepository);

export const waiveFineUseCase: IWaiveFineUseCase = new WaiveFineUseCaseImpl(
  fineRepository,
  auditLogService,
);

export const reminderPolicyService: IReminderPolicyService = new ReminderPolicyServiceImpl(
  reminderPolicyRepository,
  auditLogService,
);

// Service registry object (for backwards compatibility with existing controllers)
// Includes both old services and new use cases
export interface IServiceRegistry {
  // Old services (for backwards compatibility)
  auditLog: IAuditLogService;
  // New use cases
  checkOutBook: ICheckOutBookUseCase;
  returnBook: IReturnBookUseCase;
  lookupCopy: ILookupCopyUseCase;
  createCopy: ICreateCopyUseCase;
  queryCopy: IQueryCopyUseCase;
  updateCopyStatus: IUpdateCopyStatusUseCase;
  calculateFine: ICalculateFineUseCase;
  payFine: IPayFineUseCase;
  listFines: IListFinesUseCase;
  waiveFine: IWaiveFineUseCase;
  reminderPolicy: IReminderPolicyService;
}

export const serviceRegistry: IServiceRegistry = {
  // Old services
  auditLog: auditLogService,
  // New use cases
  checkOutBook: checkOutBookUseCase,
  returnBook: returnBookUseCase,
  lookupCopy: lookupCopyUseCase,
  createCopy: createCopyUseCase,
  queryCopy: queryCopyUseCase,
  updateCopyStatus: updateCopyStatusUseCase,
  calculateFine: calculateFineUseCase,
  payFine: payFineUseCase,
  listFines: listFinesUseCase,
  waiveFine: waiveFineUseCase,
  reminderPolicy: reminderPolicyService,
};
