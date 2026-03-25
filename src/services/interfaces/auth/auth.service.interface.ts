// Auth Service Interface
// Defines the contract for authentication operations

export interface LoginResult {
  userId: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  register(
    email: string,
    password: string,
    name: string,
    phone?: string,
  ): Promise<{ userId: string; email: string; role: string }>;
  login(email: string, password: string, userAgent?: string, ip?: string): Promise<LoginResult>;
  logout(sessionId: string): Promise<void>;
  logoutAll(userId: string): Promise<void>;
  refresh(
    accessToken: string,
    refreshToken: string,
    userAgent?: string,
    ip?: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
