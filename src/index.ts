import app from './app.js';
import { config } from './config/index.js';
import { databaseService, log } from './registry/index.js';
import { LogLevel } from './services/interfaces/index.js';

// Configure logger from config
const isProduction = config.nodeEnv === 'production';
const levelMap: Record<string, LogLevel> = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
};
log.configure({
  level: levelMap[config.logLevel] ?? LogLevel.INFO,
  production: isProduction,
});

async function main() {
  // Test database connection
  try {
    await databaseService.connect();
    log.info('Server', 'Database connected');
  } catch (error) {
    log.error('Server', 'Database connection failed', { error });
    process.exit(1);
  }

  app.listen(config.port, () => {
    log.info('Server', `Server running on http://localhost:${config.port}`);
    log.info('Server', `API: http://localhost:${config.port}/api`);
  });
}

main()
  .catch(e => {
    log.error('Server', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await databaseService.disconnect();
  });
