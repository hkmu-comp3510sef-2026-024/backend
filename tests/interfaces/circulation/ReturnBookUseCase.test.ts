import { describe, it, expect, vi } from 'vitest';
import { IReturnBookUseCase, ReturnCondition, ReturnResult } from '../../../src/services/interfaces/circulation/IReturnBookUseCase.js';
import { createMockLoan, createMockFine } from '../../mocks/entities.js';

describe('IReturnBookUseCase', () => {
  describe('interface contract', () => {
    it('should define execute method with correct signature', () => {
      const mockUseCase: IReturnBookUseCase = {
        execute: vi.fn().mockResolvedValue({
          loan: createMockLoan({ status: 'RETURNED' }),
        }),
      };

      expect(typeof mockUseCase.execute).toBe('function');
    });

    it('should accept loanId and condition parameters', async () => {
      const condition: ReturnCondition = { condition: 'GOOD' };
      const mockUseCase: IReturnBookUseCase = {
        execute: vi.fn().mockResolvedValue({
          loan: createMockLoan({ status: 'RETURNED' }),
        }),
      };

      await mockUseCase.execute('loan-1', condition);

      expect(mockUseCase.execute).toHaveBeenCalledWith('loan-1', condition);
    });

    it('should return ReturnResult with loan', async () => {
      const mockLoan = createMockLoan({ status: 'RETURNED' });
      const expectedResult: ReturnResult = { loan: mockLoan };

      const mockUseCase: IReturnBookUseCase = {
        execute: vi.fn().mockResolvedValue(expectedResult),
      };

      const result = await mockUseCase.execute('loan-1', { condition: 'GOOD' });

      expect(result).toHaveProperty('loan');
      expect(result.loan.status).toBe('RETURNED');
    });

    it('should return fine when book is damaged', async () => {
      const mockLoan = createMockLoan({ status: 'RETURNED' });
      const mockFine = createMockFine({ amount: 10.00 });
      const condition: ReturnCondition = { condition: 'DAMAGED', notes: 'Cover is torn' };
      const expectedResult: ReturnResult = { loan: mockLoan, fine: mockFine };

      const mockUseCase: IReturnBookUseCase = {
        execute: vi.fn().mockResolvedValue(expectedResult),
      };

      const result = await mockUseCase.execute('loan-1', condition);

      expect(result).toHaveProperty('fine');
      expect(result.fine?.amount).toBe(10.00);
    });

    it('should handle lost book condition', async () => {
      const mockLoan = createMockLoan({ status: 'RETURNED' });
      const mockFine = createMockFine({ amount: 50.00 });
      const condition: ReturnCondition = { condition: 'LOST', notes: 'Book not returned' };
      const expectedResult: ReturnResult = { loan: mockLoan, fine: mockFine };

      const mockUseCase: IReturnBookUseCase = {
        execute: vi.fn().mockResolvedValue(expectedResult),
      };

      const result = await mockUseCase.execute('loan-1', condition);

      expect(result).toHaveProperty('fine');
      expect(result.fine?.amount).toBe(50.00);
    });

    it('should throw error when loan is not found', async () => {
      const mockUseCase: IReturnBookUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Loan not found')),
      };

      await expect(mockUseCase.execute('invalid-loan-id', { condition: 'GOOD' })).rejects.toThrow('Loan not found');
    });

    it('should throw error when loan is already returned', async () => {
      const mockUseCase: IReturnBookUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Loan already returned')),
      };

      await expect(mockUseCase.execute('loan-1', { condition: 'GOOD' })).rejects.toThrow('Loan already returned');
    });
  });
});
