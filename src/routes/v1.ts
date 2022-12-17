import { Router } from 'express';
import { authenticate } from '../middlewares/authentication';

import { router as authRouter } from './v1/authRouter';
import { router as groupRouter } from './v1/groupRouter';
import { router as healthRouter } from './v1/healthRouter';
import { router as permissionRouter } from './v1/permissionRouter';
import { router as userRouter } from './v1/userRouter';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/permissions', authenticate(), permissionRouter);
router.use('/groups', authenticate(), groupRouter);
router.use('/users', authenticate(), userRouter);

export default router;
