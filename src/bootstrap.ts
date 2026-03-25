// Bootstrap - initializes database connection and registry
import { prisma } from './adapters/persistence/prisma/PrismaClient.js';
import { repoRegistry, serviceRegistry } from './registry/index.js';

export async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('Bootstrap complete');
  } catch (error) {
    console.error('Bootstrap failed:', error);
    throw error;
  }
}

export { repoRegistry, serviceRegistry };
