import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import bookController from '../controllers/book.controller.js';
import memberController from '../controllers/member.controller.js';
import adminController from '../controllers/admin.controller.js';
import circulationController from '../controllers/circulation.controller.js';
import assistantController from '../controllers/assistant.controller.js';
import notificationController from '../controllers/notification.controller.js';
import { success } from '../utils/response.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json(success({ timestamp: new Date().toISOString() }, 'OK'));
});

// Auth routes (public)
router.use('/auth', authController);

// Book routes (public search; member detail)
router.use('/books', bookController);

// Member routes (authenticated)
router.use('/member', memberController);

// Admin routes (authenticated librarian/admin)
router.use('/admin', adminController);

// Circulation routes (authenticated librarian/admin)
router.use('/circulation', circulationController);

// Assistant routes (public - no auth required)
router.use('/assistant', assistantController);

// Notification routes (authenticated)
router.use('/notifications', notificationController);

export default router;
