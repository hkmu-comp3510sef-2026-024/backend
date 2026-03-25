import { describe, it, expect, vi } from 'vitest';
import { ILookupCopyUseCase, LookupResult } from '../../../src/services/interfaces/circulation/ILookupCopyUseCase.js';
import { createMockCopy, createMockBook, createMockLoan } from '../../mocks/entities.js';

describe('ILookupCopyUseCase', () => {
  describe('interface contract', () => {
    it('should define execute method with correct signature', () => {
      const mockUseCase: ILookupCopyUseCase = {
        execute: vi.fn().mockResolvedValue({
          copy: createMockCopy(),
          book: createMockBook(),
        }),
      };

      expect(typeof mockUseCase.execute).toBe('function');
    });

    it('should accept copyBarcode parameter', async () => {
      const mockUseCase: ILookupCopyUseCase = {
        execute: vi.fn().mockResolvedValue({
          copy: createMockCopy(),
          book: createMockBook(),
        }),
      };

      await mockUseCase.execute('1234567890');

      expect(mockUseCase.execute).toHaveBeenCalledWith('1234567890');
    });

    it('should return LookupResult with copy and book', async () => {
      const mockCopy = createMockCopy();
      const mockBook = createMockBook();
      const expectedResult: LookupResult = { copy: mockCopy, book: mockBook };

      const mockUseCase: ILookupCopyUseCase = {
        execute: vi.fn().mockResolvedValue(expectedResult),
      };

      const result = await mockUseCase.execute('1234567890');

      expect(result).toHaveProperty('copy');
      expect(result).toHaveProperty('book');
      expect(result.copy).toEqual(mockCopy);
      expect(result.book).toEqual(mockBook);
    });

    it('should include loan when copy is on loan', async () => {
      const mockCopy = createMockCopy({ status: 'ON_LOAN' });
      const mockLoan = createMockLoan();
      const expectedResult: LookupResult = { copy: mockCopy, book: createMockBook(), loan: mockLoan };

      const mockUseCase: ILookupCopyUseCase = {
        execute: vi.fn().mockResolvedValue(expectedResult),
      };

      const result = await mockUseCase.execute('1234567890');

      expect(result).toHaveProperty('loan');
      expect(result.loan).toEqual(mockLoan);
    });

    it('should return null loan when copy is available', async () => {
      const mockCopy = createMockCopy({ status: 'AVAILABLE' });
      const expectedResult: LookupResult = { copy: mockCopy, book: createMockBook(), loan: null };

      const mockUseCase: ILookupCopyUseCase = {
        execute: vi.fn().mockResolvedValue(expectedResult),
      };

      const result = await mockUseCase.execute('1234567890');

      expect(result.loan).toBeNull();
    });

    it('should throw error when copy is not found', async () => {
      const mockUseCase: ILookupCopyUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Copy not found')),
      };

      await expect(mockUseCase.execute('invalid-barcode')).rejects.toThrow('Copy not found');
    });
  });
});
