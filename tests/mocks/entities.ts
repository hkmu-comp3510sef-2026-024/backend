import { Book } from '../../src/domain/entities/Book.js';
import { Copy, CopyStatus } from '../../src/domain/entities/Copy.js';
import { Loan, LoanStatus } from '../../src/domain/entities/Loan.js';
import { Fine, FineStatus } from '../../src/domain/entities/Fine.js';
import { ReminderPolicy } from '../../src/domain/entities/ReminderPolicy.js';

export const createMockBook = (overrides?: Partial<Book>): Book => ({
  id: 'book-1',
  isbn: '978-0-13-468599-1',
  title: 'The Pragmatic Programmer',
  author: 'David Thomas',
  category: 'Programming',
  description: 'A guide to programming',
  publishYear: 2019,
  coverUrl: 'https://example.com/cover.jpg',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockCopy = (overrides?: Partial<Copy>): Copy => ({
  id: 'copy-1',
  bookId: 'book-1',
  barcode: '1234567890',
  location: 'Shelf A-1',
  status: 'AVAILABLE' as CopyStatus,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockLoan = (overrides?: Partial<Loan>): Loan => ({
  id: 'loan-1',
  userId: 'user-1',
  copyId: 'copy-1',
  bookId: 'book-1',
  status: 'ACTIVE' as LoanStatus,
  borrowedAt: new Date('2024-01-01'),
  dueDate: new Date('2024-01-15'),
  renewCount: 0,
  maxRenews: 2,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockFine = (overrides?: Partial<Fine>): Fine => ({
  id: 'fine-1',
  userId: 'user-1',
  loanId: 'loan-1',
  amount: 5.00,
  status: 'UNPAID' as FineStatus,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  ...overrides,
});

export const createMockReminderPolicy = (overrides?: Partial<ReminderPolicy>): ReminderPolicy => ({
  id: 'policy-1',
  dueDaysBefore: [7, 3, 1],
  overdueDaysAfter: [1, 3, 7],
  dailyFineAmount: 0.50,
  maxFineAmount: 10.00,
  graceDays: 3,
  loanDays: 14,
  reservationHoldDays: 3,
  updatedBy: 'admin-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});
