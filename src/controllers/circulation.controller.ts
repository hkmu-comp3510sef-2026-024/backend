import { Request, Response, Router } from 'express';
import {
  checkOutBookUseCase,
  returnBookUseCase,
  lookupCopyUseCase,
} from '../registry/services.registry.js';
import { uow } from '../registry/repositories.registry.js';
import { success } from '../utils/response.js';
import { AppError, ErrorCode } from '../middlewares/errorHandler.js';
import { ReturnCondition } from '../services/interfaces/circulation/IReturnBookUseCase.js';
import { z } from 'zod';
import { validateBody, validateQuery } from '../middlewares/index.js';

const router = Router();

const mapCondition = (c: number): ReturnCondition => {
  switch (c) {
    case 1:
      return { condition: 'GOOD' };
    case 2:
      return { condition: 'DAMAGED' };
    case 3:
      return { condition: 'LOST' };
    default:
      return { condition: 'GOOD' };
  }
};

/**
 * POST /api/circulation/checkout
 * Checkout a book for a member (librarian action)
 * Auth: Librarian/Admin
 * Body: { memberId: string, copyBarcode: string }
 */
router.post(
  '/checkout',
  validateBody(
    z.object({
      memberId: z.string({ required_error: 'memberId is required' }),
      copyBarcode: z.string({ required_error: 'copyBarcode is required' }),
    }),
  ),
  async (req: Request, res: Response) => {
    const { memberId, copyBarcode } = req.body;

    const result = await uow.transaction(async () =>
      checkOutBookUseCase.execute(memberId, copyBarcode),
    );
    res.status(201).json(success({ loan: result.loan }, 'Book checked out'));
  },
);

/**
 * POST /api/circulation/return
 * Return a book
 * Auth: Librarian/Admin
 * Body: { copyBarcode: string, condition: 1=Normal 2=Damaged 3=Lost }
 */
router.post(
  '/return',
  validateBody(
    z.object({
      copyBarcode: z.string({ required_error: 'copyBarcode is required' }),
      condition: z
        .number({ required_error: 'condition is required' })
        .int()
        .min(1, 'condition must be 1 (Normal), 2 (Damaged), or 3 (Lost)')
        .max(3, 'condition must be 1 (Normal), 2 (Damaged), or 3 (Lost)'),
    }),
  ),
  async (req: Request, res: Response) => {
    const { copyBarcode, condition } = req.body;

    // Find the loan by copy barcode
    const lookupResult = await lookupCopyUseCase.execute(copyBarcode);
    if (!lookupResult.loan) {
      throw new AppError(404, 'No active loan found for this copy', ErrorCode.NOT_FOUND);
    }
    const loan = lookupResult.loan;

    const result = await uow.transaction(async () =>
      returnBookUseCase.execute(loan.id, mapCondition(condition)),
    );
    res.json(success({ loan: result.loan, fine: result.fine }, 'Book returned'));
  },
);

/**
 * GET /api/circulation/lookup
 * Lookup copy by barcode
 * Auth: Librarian/Admin
 * Query: barcode
 */
router.get(
  '/lookup',
  validateQuery(
    z.object({
      barcode: z.string({ required_error: 'barcode is required' }),
    }),
  ),
  async (req: Request, res: Response) => {
    const { barcode } = req.query;

    const result = await lookupCopyUseCase.execute(barcode as string); //zod validated barcode as string
    res.json(success(result, 'Copy lookup'));
  },
);

export default router;
