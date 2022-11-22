import { Router } from 'express';
import * as responses from '../../utils/responses';
import validateRequest from '../../middlewares/validateRequest';
import { body, query } from 'express-validator';
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
router.get(
    '/:groupId',
    query('groupId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    responses.notImplemented
);

/**
 * Update specific group
 */
router.patch(
    '/:groupId',
    query('groupId').not().isEmpty().isUUID().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    validateRequest(),
    responses.notImplemented
);

/**
 * Delete specific group
 */
router.delete(
    '/:groupId',
    query('groupId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    responses.notImplemented
);

/**
 * Add users to specific group
 */
router.patch(
    '/:groupId/users',
    query('groupId').not().isEmpty().isUUID().trim().escape(),
    body().isArray(),
    validateRequest(),
    responses.notImplemented
);

/**
 * Remove user from specific group
 */
router.delete(
    '/:groupId/users/:userId',
    query('groupId').not().isEmpty().isUUID().trim().escape(),
    query('userId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    responses.notImplemented
);
