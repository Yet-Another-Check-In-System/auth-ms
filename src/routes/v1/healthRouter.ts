import { Router } from 'express';
import * as healthController from '../../controllers/healthController';

export const router = Router();

/**
 * Health check
 */
router.get('/', healthController.get);
