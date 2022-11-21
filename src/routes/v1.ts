import { Router } from 'express';

import { router as healthRouter } from './v1/healthRouter';
import { router as userRouter } from './v1/userRouter';
import { router as permissionRouter } from './v1/permissionRouter';
import { router as userGroupRouter } from './v1/userGroupRouter';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', userRouter);
router.use('/permission', permissionRouter);
router.use('/usergroup', userGroupRouter);

export default router;
