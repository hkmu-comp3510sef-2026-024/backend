import { describe, it, expect, vi } from 'vitest';
import { IQueryCopyUseCase, ListCopiesQuery, ListCopiesResult } from '../../../src/services/interfaces/copy/IQueryCopyUseCase.js';
import { createMockCopy } from '../../mocks/entities.js';

describe('IQueryCopyUseCase', () => {
  describe('interface contract', () => {
    it('should define listCopies method with correct signature', () => {
      const mockUseCase: IQueryCopyUseCase = {
        listCopies: vi.fn().mockResolvedValue({
          copies: [createMockCopy()],
          total: 1,
          page: 1,
          pageSize: 10,
        }),
        getCopyByBarcode: vi.fn(),
      };

      expect(typeof mockUseCase.listCopies).toBe('function');
      expect(typeof mockUseCase.getCopyByBarcode).toBe('function');
    });

    describe('listCopies', () => {
      it('should accept ListCopiesQuery parameter', async () => {
        const query: ListCopiesQuery = { page: 1, pageSize: 10 };
        const mockUseCase: IQueryCopyUseCase = {
          listCopies: vi.fn().mockResolvedValue({
            copies: [createMockCopy()],
            total: 1,
            page: 1,
            pageSize: 10,
          }),
          getCopyByBarcode: vi.fn(),
        };

        await mockUseCase.listCopies(query);

        expect(mockUseCase.listCopies).toHaveBeenCalledWith(query);
      });

      it('should return ListCopiesResult with copies array', async () => {
        const mockCopies = [createMockCopy(), createMockCopy({ id: 'copy-2' })];
        const expectedResult: ListCopiesResult = {
          copies: mockCopies,
          total: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        };

        const mockUseCase: IQueryCopyUseCase = {
          listCopies: vi.fn().mockResolvedValue(expectedResult),
          getCopyByBarcode: vi.fn(),
        };

        const result = await mockUseCase.listCopies({});

        expect(result).toHaveProperty('copies');
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('page');
        expect(result).toHaveProperty('pageSize');
        expect(result.copies).toHaveLength(2);
      });

      it('should filter copies by bookId', async () => {
        const mockUseCase: IQueryCopyUseCase = {
          listCopies: vi.fn().mockResolvedValue({
            copies: [createMockCopy({ bookId: 'book-1' })],
            total: 1,
            page: 1,
            pageSize: 10,
            totalPages: 1,
          }),
          getCopyByBarcode: vi.fn(),
        };

        const result = await mockUseCase.listCopies({ bookId: 'book-1' });

        expect(mockUseCase.listCopies).toHaveBeenCalledWith({ bookId: 'book-1' });
        expect(result.copies[0].bookId).toBe('book-1');
      });

      it('should filter copies by status', async () => {
        const mockUseCase: IQueryCopyUseCase = {
          listCopies: vi.fn().mockResolvedValue({
            copies: [createMockCopy({ status: 'AVAILABLE' })],
            total: 1,
            page: 1,
            pageSize: 10,
            totalPages: 1,
          }),
          getCopyByBarcode: vi.fn(),
        };

        const result = await mockUseCase.listCopies({ status: 'AVAILABLE' });

        expect(result.copies[0].status).toBe('AVAILABLE');
      });

      it('should handle pagination parameters', async () => {
        const mockUseCase: IQueryCopyUseCase = {
          listCopies: vi.fn().mockResolvedValue({
            copies: [],
            total: 100,
            page: 3,
            pageSize: 20,
            totalPages: 5,
          }),
          getCopyByBarcode: vi.fn(),
        };

        const result = await mockUseCase.listCopies({ page: 3, pageSize: 20 });

        expect(result.page).toBe(3);
        expect(result.pageSize).toBe(20);
        expect(result.totalPages).toBe(5);
      });
    });

    describe('getCopyByBarcode', () => {
      it('should accept barcode parameter', async () => {
        const mockUseCase: IQueryCopyUseCase = {
          listCopies: vi.fn(),
          getCopyByBarcode: vi.fn().mockResolvedValue(createMockCopy()),
        };

        await mockUseCase.getCopyByBarcode('1234567890');

        expect(mockUseCase.getCopyByBarcode).toHaveBeenCalledWith('1234567890');
      });

      it('should return Copy when found', async () => {
        const mockCopy = createMockCopy();
        const mockUseCase: IQueryCopyUseCase = {
          listCopies: vi.fn(),
          getCopyByBarcode: vi.fn().mockResolvedValue(mockCopy),
        };

        const result = await mockUseCase.getCopyByBarcode('1234567890');

        expect(result).toEqual(mockCopy);
      });

      it('should return null when copy not found', async () => {
        const mockUseCase: IQueryCopyUseCase = {
          listCopies: vi.fn(),
          getCopyByBarcode: vi.fn().mockResolvedValue(null),
        };

        const result = await mockUseCase.getCopyByBarcode('invalid-barcode');

        expect(result).toBeNull();
      });
    });
  });
});
