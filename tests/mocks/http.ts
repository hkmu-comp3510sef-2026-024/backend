import { Request, Response, NextFunction } from 'express';
import { vi } from 'vitest';

export const createMockRequest = (overrides: Partial<Request> = {}): Request => ({
  body: {},
  query: {},
  params: {},
  user: { userId: 'user-1', email: 'test@test.com', role: 'ADMIN' as const, sessionId: 'session-1' },
  path: '/',
  method: 'GET',
  ...overrides,
} as Request);

export const createMockResponse = (): Response => {
  const res = {
    statusCode: 200,
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

export const createMockNext = (): NextFunction => vi.fn();
