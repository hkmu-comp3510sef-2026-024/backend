import { describe, it, expect, vi } from 'vitest';
import { IWaiveFineUseCase, WaiveFineData } from '../../../src/services/interfaces/fine/IWaiveFineUseCase.js';
import { createMockFine } from '../../mocks/entities.js';

describe('IWaiveFineUseCase', () => {
  describe('interface contract', () => {
    it('should define execute method with correct signature', () => {
      const mockUseCase: IWaiveFineUseCase = {
        execute: vi.fn().mockResolvedValue(createMockFine({ status: 'WAIVED' })),
      };

      expect(typeof mockUseCase.execute).toBe('function');
    });

    it('should accept WaiveFineData parameter', async () => {
      const data: WaiveFineData = {
        fineId: 'fine-1',
        waivedBy: 'admin-1',
        waiveReason: 'Customer complaint resolved',
      };
      const mockUseCase: IWaiveFineUseCase = {
        execute: vi.fn().mockResolvedValue(createMockFine({ status: 'WAIVED' })),
      };

      await mockUseCase.execute(data);

      expect(mockUseCase.execute).toHaveBeenCalledWith(data);
    });

    it('should return updated Fine with WAIVED status', async () => {
      const mockFine = createMockFine({
        status: 'WAIVED',
        waivedAt: new Date(),
        waivedBy: 'admin-1',
        waiveReason: 'Customer complaint resolved',
      });
      const mockUseCase: IWaiveFineUseCase = {
        execute: vi.fn().mockResolvedValue(mockFine),
      };

      const result = await mockUseCase.execute({
        fineId: 'fine-1',
        waivedBy: 'admin-1',
        waiveReason: 'Customer complaint resolved',
      });

      expect(result).toHaveProperty('status', 'WAIVED');
      expect(result).toHaveProperty('waivedAt');
      expect(result).toHaveProperty('waiveReason');
    });

    it('should throw error when fine does not exist', async () => {
      const mockUseCase: IWaiveFineUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Fine not found')),
      };

      await expect(
        mockUseCase.execute({
          fineId: 'invalid-fine',
          waivedBy: 'admin-1',
          waiveReason: 'Test',
        })
      ).rejects.toThrow('Fine not found');
    });

    it('should throw error when fine is already paid', async () => {
      const mockUseCase: IWaiveFineUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Cannot waive paid fine')),
      };

      await expect(
        mockUseCase.execute({
          fineId: 'fine-1',
          waivedBy: 'admin-1',
          waiveReason: 'Test',
        })
      ).rejects.toThrow('Cannot waive paid fine');
    });

    it('should throw error when fine is already waived', async () => {
      const mockUseCase: IWaiveFineUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Fine already waived')),
      };

      await expect(
        mockUseCase.execute({
          fineId: 'fine-1',
          waivedBy: 'admin-1',
          waiveReason: 'Test',
        })
      ).rejects.toThrow('Fine already waived');
    });

    it('should throw error when waiveReason is not provided', async () => {
      const mockUseCase: IWaiveFineUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Waive reason is required')),
      };

      await expect(
        mockUseCase.execute({
          fineId: 'fine-1',
          waivedBy: 'admin-1',
          waiveReason: '',
        })
      ).rejects.toThrow('Waive reason is required');
    });
  });
});
