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
router.get('/users/:userId', responses.notImplemented);

/**
 * Get all permissions for user group
 * Requires admin authentication for other users
 */
router.get('/groups/:groupId', responses.notImplemented);

/**
 * Add permissions for user group
 * Requires admin authentication
 */
router.patch('/groups/:groupId', responses.notImplemented);

/**
 * Delete permissions from user group
 * Requires admin authentication
 */
router.delete('/groups/:groupId', responses.notImplemented);
