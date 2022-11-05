import { Router } from 'express';
import { router as healthRouter } from './v1/healthRouter';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './v1/swagger_api_v1.json';

const router = Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDoc));

router.use('/health', healthRouter);

export default router;
