import { describe, it, expect, vi } from 'vitest';
import { IListFinesUseCase, ListFinesQuery, ListFinesResult } from '../../../src/services/interfaces/fine/IListFinesUseCase.js';
import { createMockFine } from '../../mocks/entities.js';

describe('IListFinesUseCase', () => {
  describe('interface contract', () => {
    it('should define listFines method with correct signature', () => {
      const mockUseCase: IListFinesUseCase = {
        listFines: vi.fn().mockResolvedValue({
          items: [createMockFine()],
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        }),
      };

      expect(typeof mockUseCase.listFines).toBe('function');
    });

    it('should accept ListFinesQuery parameter', async () => {
      const query: ListFinesQuery = { page: 1, pageSize: 10 };
      const mockUseCase: IListFinesUseCase = {
        listFines: vi.fn().mockResolvedValue({
          items: [createMockFine()],
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        }),
      };

      await mockUseCase.listFines(query);

      expect(mockUseCase.listFines).toHaveBeenCalledWith(query);
    });

    it('should return ListFinesResult with items array', async () => {
      const mockFines = [createMockFine(), createMockFine({ id: 'fine-2' })];
      const expectedResult: ListFinesResult = {
        items: mockFines,
        total: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      };

      const mockUseCase: IListFinesUseCase = {
        listFines: vi.fn().mockResolvedValue(expectedResult),
      };

      const result = await mockUseCase.listFines({});

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('pageSize');
      expect(result).toHaveProperty('totalPages');
      expect(result.items).toHaveLength(2);
    });

    it('should filter fines by status', async () => {
      const mockUseCase: IListFinesUseCase = {
        listFines: vi.fn().mockResolvedValue({
          items: [createMockFine({ status: 'UNPAID' })],
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        }),
      };

      const result = await mockUseCase.listFines({ status: 'UNPAID' });

      expect(mockUseCase.listFines).toHaveBeenCalledWith({ status: 'UNPAID' });
      expect(result.items[0].status).toBe('UNPAID');
    });

    it('should filter fines by userId', async () => {
      const mockUseCase: IListFinesUseCase = {
        listFines: vi.fn().mockResolvedValue({
          items: [createMockFine({ userId: 'user-1' })],
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        }),
      };

      const result = await mockUseCase.listFines({ userId: 'user-1' });

      expect(result.items[0].userId).toBe('user-1');
    });

    it('should handle pagination parameters', async () => {
      const mockUseCase: IListFinesUseCase = {
        listFines: vi.fn().mockResolvedValue({
          items: [],
          total: 50,
          page: 2,
          pageSize: 20,
          totalPages: 3,
        }),
      };

      const result = await mockUseCase.listFines({ page: 2, pageSize: 20 });

      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(20);
      expect(result.totalPages).toBe(3);
    });

    it('should return empty items when no fines match', async () => {
      const mockUseCase: IListFinesUseCase = {
        listFines: vi.fn().mockResolvedValue({
          items: [],
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
        }),
      };

      const result = await mockUseCase.listFines({ userId: 'invalid-user' });

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});
