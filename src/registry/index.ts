// Registry barrel export - all wired instances
// Consumers import from here, not from individual registry files

// Re-export repositories
export {
  uow,
  userRepository,
  bookRepository,
  copyRepository,
  loanRepository,
  fineRepository,
  reservationRepository,
  notificationRepository,
  auditLogRepository,
  reminderPolicyRepository,
  repoRegistry,
} from './repositories.registry.js';

// Re-export services
export {
  checkOutBookUseCase,
  returnBookUseCase,
  lookupCopyUseCase,
  createCopyUseCase,
  queryCopyUseCase,
  calculateFineUseCase,
  payFineUseCase,
  serviceRegistry,
} from './services.registry.js';

// Re-export other existing registries for backwards compatibility
export { databaseService } from './database.registry.js';
export { log } from './logger.registry.js';
