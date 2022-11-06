import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './v1/swagger_api_v1.json';

import { router as healthRouter } from './v1/healthRouter';
import { router as userRouter } from './v1/userRouter';

const router = Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDoc));

router.use('/health', healthRouter);
router.use('/auth', userRouter);

export default router;
