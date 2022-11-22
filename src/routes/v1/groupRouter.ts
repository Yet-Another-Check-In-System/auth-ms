import { Router } from 'express';
import * as responses from '../../utils/responses';
import validateRequest from '../../middlewares/validateRequest';
import { body } from 'express-validator';
import * as groupController from '../../controllers/groupController';

export const router = Router();

/**
 * Get all user groups
 */
router.get('/', responses.notImplemented);

/**
 * Create a new user group
 */
router.post(
    '/',
    body('name').not().isEmpty().trim().escape(),
    validateRequest(),
    groupController.createNewGroup
);

/**
 * Get specific group
 */
router.get('/:groupId', responses.notImplemented);

/**
 * Update specific group
 */
router.patch(
    '/:groupId',
    body('name').not().isEmpty().trim().escape(),
    validateRequest(),
    responses.notImplemented
);

/**
 * Delete specific group
 */
router.delete('/:groupId', responses.notImplemented);

/**
 * Add users to specific group
 */
router.patch(
    '/:groupId/users',
    body().isArray(),
    validateRequest(),
    responses.notImplemented
);

/**
 * Remove user from specific group
 */
router.delete('/:groupId/users/:userId', responses.notImplemented);
