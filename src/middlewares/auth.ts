import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string; role: string; sessionId: string };
      sessionId?: string;
    }
  }
}

// NOT PLANNED: Auth middleware and IAuthService are out of scope
// The jwtService and refreshService were removed during refactor

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // NOT PLANNED: JWT verification with IJwtService out of scope
  // Currently stubbed - always pass through
  next();
};

export const requireRole = (..._roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // NOT PLANNED: Role checking with IAuthService out of scope
    next();
  };
};
