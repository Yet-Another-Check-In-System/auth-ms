/**
 * Modify and get permissions of a user
 */

import { Router } from 'express';
import * as responses from '../../utils/responses';

export const router = Router();

/**
 * Get all permissions for user
 * Requires admin authentication for other users
 */
router.get('/user/:userId', responses.notImplemented);

/**
 * Update permissions for user
 * Requires admin authentication
 */
router.put('/user/:userId', responses.notImplemented);

/**
 * Get all permissions for user group
 * Requires admin authentication for other users
 */
router.get('/group/:groupId', responses.notImplemented);

/**
 * Update permissions for user group
 * Requires admin authentication
 */
router.put('/group/:groupId', responses.notImplemented);
