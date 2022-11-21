import { Router } from 'express';
import * as responses from '../../utils/responses';

export const router = Router();

/**
 * Get all user groups
 */
router.get('/', responses.notImplemented);

/**
 * Create a new user group
 */
router.post('/', responses.notImplemented);

/**
 * Get specific group
 */
router.get('/:userGroupId', responses.notImplemented);

/**
 * Update specific group
 */
router.put('/:userGroupId', responses.notImplemented);

/**
 * Delete specific group
 */
router.delete('/:userGroupId', responses.notImplemented);

/**
 * Get users of specific group
 */
router.get('/:userGroupId/users', responses.notImplemented);

/**
 * Add user to specific group
 */
router.patch('/:userGroupId/users', responses.notImplemented);
