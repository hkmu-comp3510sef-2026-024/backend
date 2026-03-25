// Mock Prisma client and persistence layer before any imports
vi.mock('../src/adapters/persistence/prisma/PrismaClient.js', () => ({
  prisma: {},
}));

vi.mock('../src/adapters/persistence/prisma/PrismaUnitOfWork.js', () => ({
  PrismaUnitOfWork: class {
    transaction = vi.fn().mockImplementation(async (fn: Function) => fn());
  },
}));
