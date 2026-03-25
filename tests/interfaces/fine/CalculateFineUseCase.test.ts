import { describe, it, expect, vi } from 'vitest';
import { ICalculateFineUseCase, CalculateFineData } from '../../../src/services/interfaces/fine/ICalculateFineUseCase.js';
import { createMockFine } from '../../mocks/entities.js';

describe('ICalculateFineUseCase', () => {
  describe('interface contract', () => {
    it('should define execute method with correct signature', () => {
      const mockUseCase: ICalculateFineUseCase = {
        execute: vi.fn().mockResolvedValue(createMockFine()),
      };

      expect(typeof mockUseCase.execute).toBe('function');
    });

    it('should accept CalculateFineData parameter', async () => {
      const data: CalculateFineData = { loanId: 'loan-1' };
      const mockUseCase: ICalculateFineUseCase = {
        execute: vi.fn().mockResolvedValue(createMockFine()),
      };

      await mockUseCase.execute(data);

      expect(mockUseCase.execute).toHaveBeenCalledWith(data);
    });

    it('should return Fine when calculated', async () => {
      const mockFine = createMockFine({ amount: 5.50 });
      const mockUseCase: ICalculateFineUseCase = {
        execute: vi.fn().mockResolvedValue(mockFine),
      };

      const result = await mockUseCase.execute({ loanId: 'loan-1' });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('amount');
      expect(result?.amount).toBe(5.50);
    });

    it('should return null when no fine is due', async () => {
      const mockUseCase: ICalculateFineUseCase = {
        execute: vi.fn().mockResolvedValue(null),
      };

      const result = await mockUseCase.execute({ loanId: 'loan-1' });

      expect(result).toBeNull();
    });

    it('should throw error when loan does not exist', async () => {
      const mockUseCase: ICalculateFineUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Loan not found')),
      };

      await expect(
        mockUseCase.execute({ loanId: 'invalid-loan' })
      ).rejects.toThrow('Loan not found');
    });

    it('should throw error when loan is not overdue', async () => {
      const mockUseCase: ICalculateFineUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Loan is not overdue')),
      };

      await expect(
        mockUseCase.execute({ loanId: 'loan-1' })
      ).rejects.toThrow('Loan is not overdue');
    });
  });
});
