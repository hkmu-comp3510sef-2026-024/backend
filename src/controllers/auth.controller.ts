import { Request, Response, Router } from 'express';
import { success } from '../utils/response.js';

const router = Router();

// NOT PLANNED: Auth controller and IAuthService are out of scope
router.post('/register', async (req: Request, res: Response) => {
  res.status(501).json(success(null, 'Not implemented'));
});

router.post('/login', async (req: Request, res: Response) => {
  res.status(501).json(success(null, 'Not implemented'));
});

router.delete('/logout', async (req: Request, res: Response) => {
  res.status(501).json(success(null, 'Not implemented'));
});

router.delete('/logout-all', async (req: Request, res: Response) => {
  res.status(501).json(success(null, 'Not implemented'));
});

export default router;
