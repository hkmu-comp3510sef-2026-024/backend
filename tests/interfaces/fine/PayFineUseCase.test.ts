import { describe, it, expect, vi } from 'vitest';
import { IPayFineUseCase, PayFineData } from '../../../src/services/interfaces/fine/IPayFineUseCase.js';
import { createMockFine } from '../../mocks/entities.js';

describe('IPayFineUseCase', () => {
  describe('interface contract', () => {
    it('should define execute method with correct signature', () => {
      const mockUseCase: IPayFineUseCase = {
        execute: vi.fn().mockResolvedValue(createMockFine({ status: 'PAID' })),
      };

      expect(typeof mockUseCase.execute).toBe('function');
    });

    it('should accept PayFineData parameter', async () => {
      const data: PayFineData = { fineId: 'fine-1', paidBy: 'user-1' };
      const mockUseCase: IPayFineUseCase = {
        execute: vi.fn().mockResolvedValue(createMockFine({ status: 'PAID' })),
      };

      await mockUseCase.execute(data);

      expect(mockUseCase.execute).toHaveBeenCalledWith(data);
    });

    it('should return updated Fine with PAID status', async () => {
      const mockFine = createMockFine({ status: 'PAID', paidAt: new Date() });
      const mockUseCase: IPayFineUseCase = {
        execute: vi.fn().mockResolvedValue(mockFine),
      };

      const result = await mockUseCase.execute({ fineId: 'fine-1', paidBy: 'user-1' });

      expect(result).toHaveProperty('status', 'PAID');
      expect(result).toHaveProperty('paidAt');
    });

    it('should throw error when fine does not exist', async () => {
      const mockUseCase: IPayFineUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Fine not found')),
      };

      await expect(
        mockUseCase.execute({ fineId: 'invalid-fine', paidBy: 'user-1' })
      ).rejects.toThrow('Fine not found');
    });

    it('should throw error when fine is already paid', async () => {
      const mockUseCase: IPayFineUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Fine already paid')),
      };

      await expect(
        mockUseCase.execute({ fineId: 'fine-1', paidBy: 'user-1' })
      ).rejects.toThrow('Fine already paid');
    });

    it('should throw error when fine is waived', async () => {
      const mockUseCase: IPayFineUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Fine has been waived')),
      };

      await expect(
        mockUseCase.execute({ fineId: 'fine-1', paidBy: 'user-1' })
      ).rejects.toThrow('Fine has been waived');
    });
  });
});
