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
router.get('/:groupId', responses.notImplemented);

/**
 * Update specific group
 */
router.patch('/:groupId', responses.notImplemented);

/**
 * Delete specific group
 */
router.delete('/:groupId', responses.notImplemented);

/**
 * Add users to specific group
 */
router.patch('/:groupId/users', responses.notImplemented);

/**
 * Remove user from specific group
 */
router.delete('/:groupId/users/:userId', responses.notImplemented);
