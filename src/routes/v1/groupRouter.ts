import { Router } from 'express';
import { body, query } from 'express-validator';

import * as groupController from '../../controllers/groupController';
import validateRequest from '../../middlewares/validateRequest';

export const router = Router();

/**
 * Get all user groups
 */
router.get('/', groupController.getGroups);

/**
 * Create a new user group
 */
router.post(
    '/',
    body('name').not().isEmpty().trim().escape(),
    validateRequest(),
    groupController.createGroup
);

/**
 * Get specific group
 */
router.get(
    '/:groupId',
    query('groupId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    groupController.getGroup
);

/**
 * Update specific group
 */
router.patch(
    '/:groupId',
    query('groupId').not().isEmpty().isUUID().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    validateRequest(),
    groupController.updateGroup
);

/**
 * Delete specific group
 */
router.delete(
    '/:groupId',
    query('groupId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    groupController.deleteGroup
);

/**
 * Add users to specific group
 */
router.patch(
    '/:groupId/users',
    query('groupId').not().isEmpty().isUUID().trim().escape(),
    body().isArray(),
    body('*').isUUID(),
    validateRequest(),
    groupController.addUsersToGroup
);

/**
 * Remove user from specific group
 */
router.delete(
    '/:groupId/users/:userId',
    query('groupId').not().isEmpty().isUUID().trim().escape(),
    query('userId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    groupController.removeUserFromGroup
);
