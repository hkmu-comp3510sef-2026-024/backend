import { describe, it, expect, vi } from 'vitest';
import { IReminderPolicyService, UpdatePolicyData } from '../../../src/services/interfaces/reminder-policy/IReminderPolicyService.js';
import { createMockReminderPolicy } from '../../mocks/entities.js';

describe('IReminderPolicyService', () => {
  describe('interface contract', () => {
    it('should define getPolicy method with correct signature', () => {
      const mockService: IReminderPolicyService = {
        getPolicy: vi.fn().mockResolvedValue(createMockReminderPolicy()),
        updatePolicy: vi.fn(),
      };

      expect(typeof mockService.getPolicy).toBe('function');
      expect(typeof mockService.updatePolicy).toBe('function');
    });

    describe('getPolicy', () => {
      it('should return ReminderPolicy', async () => {
        const mockPolicy = createMockReminderPolicy();
        const mockService: IReminderPolicyService = {
          getPolicy: vi.fn().mockResolvedValue(mockPolicy),
          updatePolicy: vi.fn(),
        };

        const result = await mockService.getPolicy();

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('dueDaysBefore');
        expect(result).toHaveProperty('overdueDaysAfter');
        expect(result).toHaveProperty('dailyFineAmount');
        expect(result).toHaveProperty('loanDays');
      });

      it('should return default policy values', async () => {
        const mockPolicy = createMockReminderPolicy({
          dueDaysBefore: [7, 3, 1],
          overdueDaysAfter: [1, 3, 7],
          dailyFineAmount: 0.50,
          maxFineAmount: 10.00,
          graceDays: 3,
          loanDays: 14,
          reservationHoldDays: 3,
        });
        const mockService: IReminderPolicyService = {
          getPolicy: vi.fn().mockResolvedValue(mockPolicy),
          updatePolicy: vi.fn(),
        };

        const result = await mockService.getPolicy();

        expect(result.dueDaysBefore).toEqual([7, 3, 1]);
        expect(result.overdueDaysAfter).toEqual([1, 3, 7]);
        expect(result.dailyFineAmount).toBe(0.50);
        expect(result.loanDays).toBe(14);
      });
    });

    describe('updatePolicy', () => {
      it('should accept UpdatePolicyData and updatedBy parameters', async () => {
        const data: UpdatePolicyData = { loanDays: 21 };
        const mockService: IReminderPolicyService = {
          getPolicy: vi.fn(),
          updatePolicy: vi.fn().mockResolvedValue(createMockReminderPolicy({ loanDays: 21 })),
        };

        await mockService.updatePolicy(data, 'admin-1');

        expect(mockService.updatePolicy).toHaveBeenCalledWith(data, 'admin-1');
      });

      it('should return updated ReminderPolicy', async () => {
        const updatedPolicy = createMockReminderPolicy({ loanDays: 21 });
        const mockService: IReminderPolicyService = {
          getPolicy: vi.fn(),
          updatePolicy: vi.fn().mockResolvedValue(updatedPolicy),
        };

        const result = await mockService.updatePolicy({ loanDays: 21 }, 'admin-1');

        expect(result.loanDays).toBe(21);
      });

      it('should update multiple fields at once', async () => {
        const data: UpdatePolicyData = {
          loanDays: 21,
          dailyFineAmount: 1.00,
          graceDays: 5,
        };
        const updatedPolicy = createMockReminderPolicy({
          loanDays: 21,
          dailyFineAmount: 1.00,
          graceDays: 5,
        });
        const mockService: IReminderPolicyService = {
          getPolicy: vi.fn(),
          updatePolicy: vi.fn().mockResolvedValue(updatedPolicy),
        };

        const result = await mockService.updatePolicy(data, 'admin-1');

        expect(result.loanDays).toBe(21);
        expect(result.dailyFineAmount).toBe(1.00);
        expect(result.graceDays).toBe(5);
      });

      it('should throw error when operator is not authorized', async () => {
        const mockService: IReminderPolicyService = {
          getPolicy: vi.fn(),
          updatePolicy: vi.fn().mockRejectedValue(new Error('Not authorized to update policy')),
        };

        await expect(
          mockService.updatePolicy({ loanDays: 21 }, 'user-1')
        ).rejects.toThrow('Not authorized to update policy');
      });

      it('should throw error when loanDays is invalid', async () => {
        const mockService: IReminderPolicyService = {
          getPolicy: vi.fn(),
          updatePolicy: vi.fn().mockRejectedValue(new Error('Invalid loan days value')),
        };

        await expect(
          mockService.updatePolicy({ loanDays: -1 }, 'admin-1')
        ).rejects.toThrow('Invalid loan days value');
      });

      it('should throw error when dailyFineAmount is negative', async () => {
        const mockService: IReminderPolicyService = {
          getPolicy: vi.fn(),
          updatePolicy: vi.fn().mockRejectedValue(new Error('Fine amount cannot be negative')),
        };

        await expect(
          mockService.updatePolicy({ dailyFineAmount: -5 }, 'admin-1')
        ).rejects.toThrow('Fine amount cannot be negative');
      });
    });
  });
});
