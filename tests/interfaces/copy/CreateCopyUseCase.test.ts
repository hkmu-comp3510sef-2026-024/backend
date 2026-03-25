import { describe, it, expect, vi } from 'vitest';
import { ICreateCopyUseCase, CreateCopyData } from '../../../src/services/interfaces/copy/ICreateCopyUseCase.js';
import { createMockCopy } from '../../mocks/entities.js';

describe('ICreateCopyUseCase', () => {
  describe('interface contract', () => {
    it('should define execute method with correct signature', () => {
      const mockUseCase: ICreateCopyUseCase = {
        execute: vi.fn().mockResolvedValue(createMockCopy()),
      };

      expect(typeof mockUseCase.execute).toBe('function');
    });

    it('should accept CreateCopyData parameter', async () => {
      const data: CreateCopyData = {
        bookId: 'book-1',
        barcode: '1234567890',
        location: 'Shelf A-1',
        status: 'AVAILABLE',
      };
      const mockUseCase: ICreateCopyUseCase = {
        execute: vi.fn().mockResolvedValue(createMockCopy()),
      };

      await mockUseCase.execute(data);

      expect(mockUseCase.execute).toHaveBeenCalledWith(data);
    });

    it('should return Copy on successful creation', async () => {
      const mockCopy = createMockCopy();
      const mockUseCase: ICreateCopyUseCase = {
        execute: vi.fn().mockResolvedValue(mockCopy),
      };

      const result = await mockUseCase.execute({
        bookId: 'book-1',
        barcode: '1234567890',
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('bookId');
      expect(result).toHaveProperty('barcode');
    });

    it('should accept optional location parameter', async () => {
      const dataWithLocation: CreateCopyData = {
        bookId: 'book-1',
        barcode: '1234567890',
        location: 'Shelf B-2',
      };

      const mockUseCase: ICreateCopyUseCase = {
        execute: vi.fn().mockResolvedValue(createMockCopy({ location: 'Shelf B-2' })),
      };

      const result = await mockUseCase.execute(dataWithLocation);

      expect(mockUseCase.execute).toHaveBeenCalledWith(dataWithLocation);
      expect(result.location).toBe('Shelf B-2');
    });

    it('should accept optional status parameter', async () => {
      const dataWithStatus: CreateCopyData = {
        bookId: 'book-1',
        barcode: '1234567890',
        status: 'PROCESSING',
      };

      const mockUseCase: ICreateCopyUseCase = {
        execute: vi.fn().mockResolvedValue(createMockCopy({ status: 'PROCESSING' })),
      };

      const result = await mockUseCase.execute(dataWithStatus);

      expect(result.status).toBe('PROCESSING');
    });

    it('should throw error when book does not exist', async () => {
      const mockUseCase: ICreateCopyUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Book not found')),
      };

      await expect(
        mockUseCase.execute({ bookId: 'invalid-book', barcode: '1234567890' })
      ).rejects.toThrow('Book not found');
    });

    it('should throw error when barcode already exists', async () => {
      const mockUseCase: ICreateCopyUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Barcode already exists')),
      };

      await expect(
        mockUseCase.execute({ bookId: 'book-1', barcode: '1234567890' })
      ).rejects.toThrow('Barcode already exists');
    });
  });
});
