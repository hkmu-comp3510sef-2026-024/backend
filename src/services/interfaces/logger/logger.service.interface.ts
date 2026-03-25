// Logger Service Interface
// Defines the contract for logging operations

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogMeta {
  [key: string]: unknown;
}

export interface ILogger {
  debug(context: string, message: string, meta?: LogMeta): void;
  info(context: string, message: string, meta?: LogMeta): void;
  warn(context: string, message: string, meta?: LogMeta): void;
  error(context: string, message: string, meta?: LogMeta): void;
  configure(options: LoggerOptions): void;
}

export interface LoggerOptions {
  level: LogLevel;
  production: boolean;
}
