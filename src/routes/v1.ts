import { Router } from 'express';

import { router as healthRouter } from './v1/healthRouter';
import { router as userRouter } from './v1/userRouter';
import { router as permissionRouter } from './v1/permissionRouter';
import { router as groupRouter } from './v1/groupRouter';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', userRouter);
router.use('/permission', permissionRouter);
router.use('/group', groupRouter);

export default router;
