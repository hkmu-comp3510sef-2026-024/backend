// Database registry - wires database service
import { PrismaDatabaseService } from '../services/impl/database/index.js';
import type { IDatabase } from '../services/interfaces/index.js';

const _databaseService = new PrismaDatabaseService();

export const databaseService: IDatabase = _databaseService;
