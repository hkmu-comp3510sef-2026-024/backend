import { Request, Response, Router } from 'express';
import { success } from '../utils/response.js';

const router = Router();

/**
 * GET /api/books/search
 * Search books by keyword, category, author, etc.
 * Public endpoint
 */
router.get('/search', async (req: Request, res: Response) => {
  // TODO: Implement book search
  // Query params: keyword, category, author, availableOnly, page, pageSize
  res.json(success({ items: [], total: 0, page: 1, pageSize: 20, totalPages: 0 }, 'Search books'));
});

/**
 * GET /api/books/:bookId
 * Get book detail with real-time copy stats
 * Public endpoint
 */
router.get('/:bookId', async (req: Request, res: Response) => {
  // TODO: Implement book detail
  // Response: book details + available/total copies count
  res.json(success({ book: null, availableCopies: 0, totalCopies: 0 }, 'Book details'));
});

export default router;
