import { Router } from 'express';

import * as controller from '../../controllers/healthController';

export const router = Router();

/**
 * Health check
 */
router.get('/', controller.get);
