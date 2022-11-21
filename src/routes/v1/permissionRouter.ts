/**
 * Modify and get permissions of a user
 */

import { Router } from 'express';
import * as responses from '../../utils/responses';

export const router = Router();

/**
 * Get all permissions for calling user
 */
router.get('/user', responses.notImplemented);

/**
 * Get all permissions for user
 * Requires admin authentication
 */
router.get('/user/:userId', responses.notImplemented);

/**
 * Add permissions for user
 * Requires admin authentication
 */
router.post('/user/:userId', responses.notImplemented);

/**
 * Get all permissions for user group
 * Requires admin authentication
 */
router.get('/group/:userGroupId', responses.notImplemented);

/**
 * Add permissions for user group
 * Requires admin authentication
 */
router.post('/group/:userGroupId', responses.notImplemented);
