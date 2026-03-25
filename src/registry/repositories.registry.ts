// Repositories registry - wires all repository singletons
import { prisma } from '../adapters/persistence/prisma/PrismaClient.js';
import { PrismaUnitOfWork } from '../adapters/persistence/prisma/PrismaUnitOfWork.js';
import { PrismaUserRepository } from '../adapters/persistence/prisma/PrismaUserRepository.js';
import { PrismaBookRepository } from '../adapters/persistence/prisma/PrismaBookRepository.js';
import { PrismaCopyRepository } from '../adapters/persistence/prisma/PrismaCopyRepository.js';
import { PrismaLoanRepository } from '../adapters/persistence/prisma/PrismaLoanRepository.js';
import { PrismaFineRepository } from '../adapters/persistence/prisma/PrismaFineRepository.js';
import { PrismaReservationRepository } from '../adapters/persistence/prisma/PrismaReservationRepository.js';
import { PrismaNotificationRepository } from '../adapters/persistence/prisma/PrismaNotificationRepository.js';
import { PrismaAuditLogRepository } from '../adapters/persistence/prisma/PrismaAuditLogRepository.js';
import { PrismaReminderPolicyRepository } from '../adapters/persistence/prisma/PrismaReminderPolicyRepository.js';
import type { IUserRepository } from '../domain/ports/IUserRepository.js';
import type { IBookRepository } from '../domain/ports/IBookRepository.js';
import type { ICopyRepository } from '../domain/ports/ICopyRepository.js';
import type { ILoanRepository } from '../domain/ports/ILoanRepository.js';
import type { IFineRepository } from '../domain/ports/IFineRepository.js';
import type { IReservationRepository } from '../domain/ports/IReservationRepository.js';
import type { INotificationRepository } from '../domain/ports/INotificationRepository.js';
import type { IAuditLogRepository } from '../domain/ports/IAuditLogRepository.js';
import type { IReminderPolicyRepository } from '../domain/ports/IReminderPolicyRepository.js';
import type { IUnitOfWork } from '../domain/ports/IUnitOfWork.js';

// Create repository instances with constructor injection (where adapter exists)
export const uow: IUnitOfWork = new PrismaUnitOfWork();
export const userRepository: IUserRepository = new PrismaUserRepository(prisma);
export const bookRepository: IBookRepository = new PrismaBookRepository(prisma);
export const copyRepository: ICopyRepository = new PrismaCopyRepository(prisma);
export const loanRepository: ILoanRepository = new PrismaLoanRepository(prisma);
export const fineRepository: IFineRepository = new PrismaFineRepository(prisma);
export const reservationRepository: IReservationRepository = new PrismaReservationRepository(
  prisma,
);
export const notificationRepository: INotificationRepository = new PrismaNotificationRepository(
  prisma,
);
export const auditLogRepository: IAuditLogRepository = new PrismaAuditLogRepository(prisma);
export const reminderPolicyRepository: IReminderPolicyRepository =
  new PrismaReminderPolicyRepository(prisma);

// Registry object for backwards compatibility
export const repoRegistry = {
  uow,
  user: userRepository,
  book: bookRepository,
  copy: copyRepository,
  loan: loanRepository,
  fine: fineRepository,
  reservation: reservationRepository,
  notification: notificationRepository,
  auditLog: auditLogRepository,
  reminderPolicy: reminderPolicyRepository,
} as const;
