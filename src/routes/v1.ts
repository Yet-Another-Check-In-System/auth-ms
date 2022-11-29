import { Router } from 'express';

import { router as authRouter } from './v1/authRouter';
import { router as groupRouter } from './v1/groupRouter';
import { router as healthRouter } from './v1/healthRouter';
import { router as permissionRouter } from './v1/permissionRouter';
import { router as userRouter } from './v1/userRouter';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/permissions', permissionRouter);
router.use('/groups', groupRouter);
router.use('/users', userRouter);

export default router;
