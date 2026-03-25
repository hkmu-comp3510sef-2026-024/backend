import { Request, Response, Router } from 'express';
import { success } from '../utils/response.js';

const router = Router();

/**
 * GET /api/member/profile
 * Get current user's profile
 * Auth required
 */
router.get('/profile', async (req: Request, res: Response) => {
  // TODO: Implement get profile
  res.json(success({ user: null }, 'Member profile'));
});

/**
 * PUT /api/member/profile
 * Update current user's profile
 * Auth required
 */
router.put('/profile', async (req: Request, res: Response) => {
  // TODO: Implement update profile
  // Body: { name?, studentId?, phone?, address? }
  res.json(success({ user: null }, 'Profile updated'));
});

/**
 * PUT /api/member/profile/avatar
 * Upload profile avatar
 * Auth required, multipart/form-data
 */
router.put('/profile/avatar', async (req: Request, res: Response) => {
  // TODO: Implement avatar upload
  // Accept image file, returns { avatarUrl }
  res.json(success({ avatarUrl: '' }, 'Avatar updated'));
});

/**
 * GET /api/member/membership
 * Get current user's membership info
 * Auth required
 */
router.get('/membership', async (req: Request, res: Response) => {
  // TODO: Implement get membership
  res.json(success({ membership: null }, 'Membership info'));
});

/**
 * GET /api/member/loans
 * Get current user's loans
 * Auth required
 * Response includes remainingRenewals (maxRenewals - renewalCount)
 */
router.get('/loans', async (req: Request, res: Response) => {
  // TODO: Implement get loans
  res.json(success({ items: [], total: 0 }, 'Member loans'));
});

/**
 * POST /api/member/loans
 * Borrow a book
 * Auth required
 * Body: { bookId, copyId? }
 * If copyId omitted, auto-assigns first available copy
 */
router.post('/loans', async (req: Request, res: Response) => {
  // TODO: Implement borrow book
  // Auto-completes READY_FOR_PICKUP reservation for same book atomically
  res.json(success({ loan: null }, 'Book borrowed'));
});

/**
 * POST /api/member/loans/:loanId/renew
 * Renew a loan
 * Auth required
 */
router.post('/loans/:loanId/renew', async (req: Request, res: Response) => {
  // TODO: Implement renew loan
  // Checks: loan must be ACTIVE, renewalCount < maxRenewals, no QUEUED reservation
  res.json(success({ loan: null }, 'Loan renewed'));
});

/**
 * GET /api/member/reservations
 * Get current user's reservations
 * Auth required
 * Response includes queuePosition for QUEUED reservations
 */
router.get('/reservations', async (req: Request, res: Response) => {
  // TODO: Implement get reservations
  res.json(success({ items: [], total: 0 }, 'Member reservations'));
});

/**
 * POST /api/member/reservations
 * Create a reservation
 * Auth required
 * Body: { bookId }
 */
router.post('/reservations', async (req: Request, res: Response) => {
  // TODO: Implement create reservation
  res.json(success({ reservation: null }, 'Reservation created'));
});

/**
 * DELETE /api/member/reservations/:reservationId
 * Cancel a reservation
 * Auth required
 * If READY_FOR_PICKUP, triggers queue shift
 */
router.delete('/reservations/:reservationId', async (req: Request, res: Response) => {
  // TODO: Implement cancel reservation
  res.json(success(null, 'Reservation cancelled'));
});

/**
 * GET /api/member/notifications
 * Get current user's notifications
 * Auth required
 */
router.get('/notifications', async (req: Request, res: Response) => {
  // TODO: Implement get notifications
  res.json(success({ items: [], total: 0 }, 'Notifications'));
});

/**
 * PUT /api/member/notifications/read-all
 * Mark all notifications as read
 * Auth required
 */
router.put('/notifications/read-all', async (req: Request, res: Response) => {
  // TODO: Implement read all notifications
  res.json(success(null, 'All notifications marked as read'));
});

/**
 * GET /api/member/recommendations
 * Get book recommendations
 * Auth required
 * Query: seed (optional) for deterministic selection
 */
router.get('/recommendations', async (req: Request, res: Response) => {
  // TODO: Implement recommendations (Innovation A)
  // Rule-based: same-category popular, same-author, recently added
  // Returns exactly 5 unique recommendations with reason and reasonType
  res.json(success({ items: [] }, 'Recommendations'));
});

export default router;
