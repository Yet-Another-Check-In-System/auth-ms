import { Router } from 'express';
import { body, param } from 'express-validator';

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
    param('groupId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    groupController.getGroup
);

/**
 * Update specific group
 */
router.patch(
    '/:groupId',
    param('groupId').not().isEmpty().isUUID().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    validateRequest(),
    groupController.updateGroup
);

/**
 * Delete specific group
 */
router.delete(
    '/:groupId',
    param('groupId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    groupController.deleteGroup
);

/**
 * Add users to specific group
 */
router.patch(
    '/:groupId/users',
    param('groupId').not().isEmpty().isUUID().trim().escape(),
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
    param('groupId').not().isEmpty().isUUID().trim().escape(),
    param('userId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    groupController.removeUserFromGroup
);
