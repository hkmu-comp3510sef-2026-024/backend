// JWT Service Interface
// Defines the contract for JWT operations

import type { JwtPayload } from '../../../types/auth.types.js';

export interface IJwtService {
  generate(payload: Omit<JwtPayload, 'sessionId'> & { sessionId?: string }): string;
  verify(token: string): JwtPayload;
}
