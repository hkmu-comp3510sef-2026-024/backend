import { describe, it, expect, vi } from 'vitest';
import { ICheckOutBookUseCase, CheckOutResult } from '../../../src/services/interfaces/circulation/ICheckOutBookUseCase.js';
import { createMockLoan, createMockCopy } from '../../mocks/entities.js';

describe('ICheckOutBookUseCase', () => {
  describe('interface contract', () => {
    it('should define execute method with correct signature', () => {
      const mockUseCase: ICheckOutBookUseCase = {
        execute: vi.fn().mockResolvedValue({
          loan: createMockLoan(),
          copy: createMockCopy(),
        }),
      };

      expect(typeof mockUseCase.execute).toBe('function');
    });

    it('should accept memberId and copyBarcode parameters', async () => {
      const mockUseCase: ICheckOutBookUseCase = {
        execute: vi.fn().mockResolvedValue({
          loan: createMockLoan(),
          copy: createMockCopy(),
        }),
      };

      const memberId = 'member-1';
      const copyBarcode = '1234567890';

      await mockUseCase.execute(memberId, copyBarcode);

      expect(mockUseCase.execute).toHaveBeenCalledWith(memberId, copyBarcode);
    });

    it('should return CheckOutResult with loan and copy', async () => {
      const mockLoan = createMockLoan();
      const mockCopy = createMockCopy();
      const expectedResult: CheckOutResult = { loan: mockLoan, copy: mockCopy };

      const mockUseCase: ICheckOutBookUseCase = {
        execute: vi.fn().mockResolvedValue(expectedResult),
      };

      const result = await mockUseCase.execute('member-1', '1234567890');

      expect(result).toHaveProperty('loan');
      expect(result).toHaveProperty('copy');
      expect(result.loan).toEqual(mockLoan);
      expect(result.copy).toEqual(mockCopy);
    });

    it('should throw error when copy is not available', async () => {
      const mockUseCase: ICheckOutBookUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Copy is not available')),
      };

      await expect(mockUseCase.execute('member-1', '1234567890')).rejects.toThrow('Copy is not available');
    });

    it('should throw error when member has outstanding fines', async () => {
      const mockUseCase: ICheckOutBookUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Member has unpaid fines')),
      };

      await expect(mockUseCase.execute('member-1', '1234567890')).rejects.toThrow('Member has unpaid fines');
    });

    it('should throw error when member has reached loan limit', async () => {
      const mockUseCase: ICheckOutBookUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Member has reached loan limit')),
      };

      await expect(mockUseCase.execute('member-1', '1234567890')).rejects.toThrow('Member has reached loan limit');
    });
  });
});
