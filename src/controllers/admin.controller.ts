import { Request, Response, Router } from 'express';
import { success } from '../utils/response.js';
import { serviceRegistry } from '../registry/index.js';
import {
  queryCopyUseCase,
  createCopyUseCase,
  updateCopyStatusUseCase,
  listFinesUseCase,
  payFineUseCase,
  waiveFineUseCase,
  reminderPolicyService,
} from '../registry/services.registry.js';
import { uow } from '../registry/repositories.registry.js';
import { AppError, ErrorCode } from '../middlewares/errorHandler.js';
import { FineStatus, CopyStatus } from '@prisma/client';
import { validateQuery, validateBody } from '../middlewares/index.js';
import { z } from 'zod';
import {
  ListFinesQuery,
  QueryCopiesQuery,
  SearchAuditLogsQuery,
} from '../services/interfaces/index.js';

const router = Router();

// ============ Assistant Knowledge (Admin CRUD) ============

router.get('/assistant/knowledge', async (req: Request, res: Response) => {
  // TODO: Implement list knowledge entries
  res.json(success({ items: [], total: 0 }, 'Knowledge entries'));
});

router.get('/assistant/knowledge/:knowledgeId', async (req: Request, res: Response) => {
  // TODO: Implement get knowledge entry
  res.json(success({ entry: null }, 'Knowledge entry'));
});

router.post('/assistant/knowledge', async (req: Request, res: Response) => {
  // TODO: Implement create knowledge entry
  res.json(success({ entry: null }, 'Knowledge entry created'));
});

router.put('/assistant/knowledge/:knowledgeId', async (req: Request, res: Response) => {
  // TODO: Implement update knowledge entry
  res.json(success({ entry: null }, 'Knowledge entry updated'));
});

router.delete('/assistant/knowledge/:knowledgeId', async (req: Request, res: Response) => {
  // TODO: Implement delete knowledge entry
  res.json(success(null, 'Knowledge entry deleted'));
});

// ============ Member Management ============

router.get('/members', async (req: Request, res: Response) => {
  // TODO: Implement list members
  res.json(success({ items: [], total: 0 }, 'Members list'));
});

router.post('/members/:memberId/approve', async (req: Request, res: Response) => {
  // TODO: Implement approve member
  res.json(success({ member: null }, 'Member approved'));
});

router.post('/members/:memberId/freeze', async (req: Request, res: Response) => {
  // TODO: Implement freeze member
  res.json(success(null, 'Member frozen'));
});

router.post('/members/:memberId/unfreeze', async (req: Request, res: Response) => {
  // TODO: Implement unfreeze member
  res.json(success(null, 'Member unfrozen'));
});

router.post('/members/:memberId/renew', async (req: Request, res: Response) => {
  // TODO: Implement renew member membership
  res.json(success(null, 'Membership renewed'));
});

// ============ Book Management ============

router.get('/books', async (req: Request, res: Response) => {
  // TODO: Implement list books
  res.json(success({ items: [], total: 0 }, 'Books list'));
});

router.post('/books', async (req: Request, res: Response) => {
  // TODO: Implement create book
  res.json(success({ book: null }, 'Book created'));
});

router.put('/books/:bookId', async (req: Request, res: Response) => {
  // TODO: Implement update book
  res.json(success({ book: null }, 'Book updated'));
});

router.put('/books/:bookId/cover', async (req: Request, res: Response) => {
  // TODO: Implement update book cover
  res.json(success({ coverUrl: '' }, 'Cover updated'));
});

router.put('/books/:bookId/deactivate', async (req: Request, res: Response) => {
  // TODO: Implement deactivate book
  res.json(success(null, 'Book deactivated'));
});

// ============ Copy Management ============

/**
 * GET /api/admin/copies
 * List all copies (paginated)
 * Query: bookId?, status?, page, pageSize
 */
router.get(
  '/copies',
  validateQuery(
    z.object({
      bookId: z.string().optional(),
      status: z.nativeEnum(CopyStatus).optional(),
      page: z.coerce.number().optional().default(1),
      pageSize: z.coerce.number().optional().default(20),
    }),
  ),
  async (req: Request, res: Response) => {
    const result = await queryCopyUseCase.listCopies(req.query as QueryCopiesQuery);
    res.json(success(result, 'Copies list'));
  },
);

/**
 * POST /api/admin/copies
 * Create new copy
 * Body: { bookId, barcode, location }
 */
router.post(
  '/copies',
  validateBody(
    z.object({
      bookId: z.string({ required_error: 'bookId is required' }),
      barcode: z.string({ required_error: 'barcode is required' }),
      location: z.string({ required_error: 'location is required' }),
    }),
  ),
  async (req: Request, res: Response) => {
    const { bookId, barcode, location } = req.body;
    const copy = await uow.transaction(async () =>
      createCopyUseCase.execute({ bookId, barcode, location }),
    );
    res.status(201).json(success({ copy }, 'Copy created'));
  },
);

/**
 * PUT /api/admin/copies/:copyId/status
 * Update copy status
 * Body: { status: CopyStatus }
 */
router.put(
  '/copies/:copyId/status',
  validateBody(
    z.object({
      status: z.nativeEnum(CopyStatus, { required_error: 'status is required' }),
    }),
  ),
  async (req: Request, res: Response) => {
    const copyId = req.params.copyId as string;
    const { status } = req.body;
    const operatorId = req.user?.userId ?? '';
    const copy = await uow.transaction(async () =>
      updateCopyStatusUseCase.execute({ copyId, newStatus: status, operatorId }),
    );
    res.json(success({ copy }, 'Copy status updated'));
  },
);

// ============ Fine Management ============

/**
 * GET /api/admin/fines
 * List all fines (paginated)
 * Query: status?, userId?, page, pageSize
 */
router.get(
  '/fines',
  validateQuery(
    z.object({
      status: z.nativeEnum(FineStatus).optional(),
      userId: z.string().optional(),
      page: z.coerce.number().optional().default(1),
      pageSize: z.coerce.number().optional().default(20),
    }),
  ),
  async (req: Request, res: Response) => {
    const { status, userId, page, pageSize } = req.query as ListFinesQuery;
    const result = await listFinesUseCase.listFines({ status, userId, page, pageSize });
    res.json(success(result, 'Fines list'));
  },
);

/**
 * POST /api/admin/fines/:fineId/pay
 * Mark fine as paid
 */
router.post('/fines/:fineId/pay', async (req: Request, res: Response) => {
  const fineId = req.params.fineId as string;
  const operatorId = req.user?.userId ?? '';
  const fine = await uow.transaction(async () =>
    payFineUseCase.execute({ fineId, paidBy: operatorId }),
  );
  res.json(success({ fine }, 'Fine marked as paid'));
});

/**
 * POST /api/admin/fines/:fineId/waive
 * Waive fine
 * Body: { reason: string }
 */
router.post(
  '/fines/:fineId/waive',
  validateBody(
    z.object({
      reason: z.string({ required_error: 'waive reason is required' }),
    }),
  ),
  async (req: Request, res: Response) => {
    const fineId = req.params.fineId as string;
    const { reason } = req.body;
    const operatorId = req.user?.userId ?? '';
    const fine = await uow.transaction(async () =>
      waiveFineUseCase.execute({
        fineId,
        waivedBy: operatorId,
        waiveReason: reason,
      }),
    );
    res.json(success({ fine }, 'Fine waived'));
  },
);

// ============ Reminder Policy ============

/**
 * GET /api/admin/reminder-policy
 * Get current reminder policy
 */
router.get('/reminder-policy', async (req: Request, res: Response) => {
  const policy = await reminderPolicyService.getPolicy();
  res.json(success({ policy }, 'Reminder policy'));
});

/**
 * PUT /api/admin/reminder-policy
 * Update reminder policy
 * Body: { dueDaysBefore?, overdueDaysAfter?, dailyFineAmount?, maxFineAmount?, graceDays?, reservationHoldDays? }
 */
router.put('/reminder-policy', async (req: Request, res: Response) => {
  const operatorId = req.user?.userId ?? '';
  const policy = await reminderPolicyService.updatePolicy(req.body, operatorId);
  res.json(success({ policy }, 'Reminder policy updated'));
});

// ============ Notifications ============

router.post('/notifications/announcements', async (req: Request, res: Response) => {
  // TODO: Implement broadcast announcement
  res.json(success({ count: 0 }, 'Announcement sent'));
});

// ============ Audit Logs ============

/**
 * GET /api/admin/audit-logs
 * List audit logs (paginated)
 * Query: operatorId?, action?, targetType?, targetId?, startDate?, endDate?, page, pageSize
 */
router.get(
  '/audit-logs',
  validateQuery(
    z.object({
      operatorId: z.string().optional(),
      action: z.string().optional(),
      targetType: z.string().optional(),
      targetId: z.string().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      page: z.coerce.number().optional().default(1),
      pageSize: z.coerce.number().optional().default(20),
    }),
  ),
  async (req: Request, res: Response) => {
    const result = await serviceRegistry.auditLog.searchLogs(req.query as SearchAuditLogsQuery);
    res.json(success(result, 'Audit logs'));
  },
);

/**
 * GET /api/admin/audit-logs/:logId
 * Get single audit log entry
 */
router.get('/audit-logs/:logId', async (req: Request, res: Response) => {
  const { logId } = req.params;
  const log = await serviceRegistry.auditLog.getLogById(logId as string);
  if (!log) {
    throw new AppError(404, 'Audit log not found', ErrorCode.NOT_FOUND);
  }
  res.json(success({ log }, 'Audit log'));
});

export default router;
