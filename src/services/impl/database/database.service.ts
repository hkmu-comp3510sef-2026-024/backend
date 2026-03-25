// Database service - implements IDatabase using Prisma singleton
import { prisma } from '../../../adapters/persistence/prisma/PrismaClient.js';
import type { IDatabase } from '../../interfaces/database/database.interface.js';

export class PrismaDatabaseService implements IDatabase {
  private _connected = false;

  async connect(): Promise<void> {
    if (this._connected) return;
    await prisma.$connect();
    this._connected = true;
  }

  async disconnect(): Promise<void> {
    if (!this._connected) return;
    await prisma.$disconnect();
    this._connected = false;
  }

  isConnected(): boolean {
    return this._connected;
  }
}
