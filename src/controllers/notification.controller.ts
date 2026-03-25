import { Request, Response, Router } from 'express';
import { success } from '../utils/response.js';

const router = Router();

/**
 * PUT /api/notifications/:notificationId/read
 * Mark a notification as read
 * Auth required
 */
router.put('/:notificationId/read', async (req: Request, res: Response) => {
  // TODO: Implement mark notification as read
  res.json(success(null, 'Notification marked as read'));
});

export default router;
