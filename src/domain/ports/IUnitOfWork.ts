// src/domain/ports/IUnitOfWork.ts
export interface IUnitOfWork {
  transaction<T>(fn: () => Promise<T>): Promise<T>;
}
