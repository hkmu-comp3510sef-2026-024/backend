import { describe, it, expect, vi } from 'vitest';
import { IUpdateCopyStatusUseCase, UpdateCopyStatusData } from '../../../src/services/interfaces/copy/IUpdateCopyStatusUseCase.js';
import { createMockCopy } from '../../mocks/entities.js';

describe('IUpdateCopyStatusUseCase', () => {
  describe('interface contract', () => {
    it('should define execute method with correct signature', () => {
      const mockUseCase: IUpdateCopyStatusUseCase = {
        execute: vi.fn().mockResolvedValue(createMockCopy()),
      };

      expect(typeof mockUseCase.execute).toBe('function');
    });

    it('should accept UpdateCopyStatusData parameter', async () => {
      const data: UpdateCopyStatusData = {
        copyId: 'copy-1',
        newStatus: 'AVAILABLE',
        operatorId: 'admin-1',
      };
      const mockUseCase: IUpdateCopyStatusUseCase = {
        execute: vi.fn().mockResolvedValue(createMockCopy()),
      };

      await mockUseCase.execute(data);

      expect(mockUseCase.execute).toHaveBeenCalledWith(data);
    });

    it('should return updated Copy', async () => {
      const mockCopy = createMockCopy({ status: 'AVAILABLE' });
      const mockUseCase: IUpdateCopyStatusUseCase = {
        execute: vi.fn().mockResolvedValue(mockCopy),
      };

      const result = await mockUseCase.execute({
        copyId: 'copy-1',
        newStatus: 'AVAILABLE',
        operatorId: 'admin-1',
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('status');
    });

    it('should throw error when copy does not exist', async () => {
      const mockUseCase: IUpdateCopyStatusUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Copy not found')),
      };

      await expect(
        mockUseCase.execute({
          copyId: 'invalid-copy',
          newStatus: 'AVAILABLE',
          operatorId: 'admin-1',
        })
      ).rejects.toThrow('Copy not found');
    });

    it('should throw error when transition is invalid', async () => {
      const mockUseCase: IUpdateCopyStatusUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Invalid status transition')),
      };

      await expect(
        mockUseCase.execute({
          copyId: 'copy-1',
          newStatus: 'ON_LOAN',
          operatorId: 'admin-1',
        })
      ).rejects.toThrow('Invalid status transition');
    });

    it('should throw error when copy is on loan', async () => {
      const mockUseCase: IUpdateCopyStatusUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Cannot update status while copy is on loan')),
      };

      await expect(
        mockUseCase.execute({
          copyId: 'copy-1',
          newStatus: 'MAINTENANCE',
          operatorId: 'admin-1',
        })
      ).rejects.toThrow('Cannot update status while copy is on loan');
    });
  });
});
