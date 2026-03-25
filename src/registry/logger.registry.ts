// Logger registry - wires logger service
import { WinstonLoggerService } from '../services/impl/logger/index.js';
import { LogLevel } from '../services/interfaces/index.js';
import type { ILogger } from '../services/interfaces/index.js';

const _loggerService = new WinstonLoggerService({
  level: LogLevel.INFO,
  production: false,
});

export const log: ILogger = _loggerService;
