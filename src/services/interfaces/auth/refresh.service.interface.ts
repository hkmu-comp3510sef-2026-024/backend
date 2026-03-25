// Refresh Service Interface
// Defines the contract for refresh token operations

export interface SessionInfo {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface IRefreshService {
  generateToken(): string;
  createSession(userId: string, token: string): Promise<string>;
  validateSession(token: string): Promise<SessionInfo>;
  deleteSession(sessionId: string): Promise<void>;
  deleteAllSessions(userId: string): Promise<void>;
}
