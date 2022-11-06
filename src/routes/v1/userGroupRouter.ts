import { Router } from 'express';
import * as responses from '../../utils/responses';

export const router = Router();

/**
 * Login
 */
router.post('/login', responses.notImplemented);

/**
 * Login with Google
 */
router.post('/login/google', responses.notImplemented);

/**
 * Login with Microsoft
 */
router.post('/login/microsoft', responses.notImplemented);

/**
 * Register
 */
router.post('/register', responses.notImplemented);
