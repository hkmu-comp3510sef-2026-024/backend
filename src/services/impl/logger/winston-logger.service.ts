import winston from 'winston';
import {
  LogLevel,
  type ILogger,
  type LoggerOptions,
  type LogMeta,
} from '../../interfaces/index.js';

const LogLevelMap: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'debug',
  [LogLevel.INFO]: 'info',
  [LogLevel.WARN]: 'warn',
  [LogLevel.ERROR]: 'error',
};

export class WinstonLoggerService implements ILogger {
  private logger: winston.Logger;
  private currentLevel: LogLevel;
  private isProduction: boolean;

  constructor(options?: Partial<LoggerOptions>) {
    this.currentLevel = options?.level ?? LogLevel.INFO;
    this.isProduction = options?.production ?? false;

    const winstonLevel = LogLevelMap[this.currentLevel] ?? 'info';

    this.logger = winston.createLogger({
      level: winstonLevel,
      format: this.isProduction
        ? winston.format.combine(winston.format.timestamp(), winston.format.json())
        : winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
              return `${timestamp} ${level}: ${message}${metaStr}`;
            }),
          ),
      transports: [new winston.transports.Console()],
    });
  }

  debug(context: string, message: string, meta?: LogMeta): void {
    this.logger.debug(message, { context, ...meta });
  }

  info(context: string, message: string, meta?: LogMeta): void {
    this.logger.info(message, { context, ...meta });
  }

  warn(context: string, message: string, meta?: LogMeta): void {
    this.logger.warn(message, { context, ...meta });
  }

  error(context: string, message: string, meta?: LogMeta): void {
    this.logger.error(message, { context, ...meta });
  }

  configure(options: LoggerOptions): void {
    this.currentLevel = options.level;
    this.isProduction = options.production;

    const winstonLevel = LogLevelMap[this.currentLevel] ?? 'info';
    this.logger.level = winstonLevel;

    // Update format based on production flag
    this.logger.format = this.isProduction
      ? winston.format.combine(winston.format.timestamp(), winston.format.json())
      : winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
            return `${timestamp} ${level}: ${message}${metaStr}`;
          }),
        );
  }
}
