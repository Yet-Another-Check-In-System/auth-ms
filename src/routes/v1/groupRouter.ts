import { Router } from 'express';
import { body, param } from 'express-validator';

import * as controller from '../../controllers/groupController';
import { authorize } from '../../middlewares/authentication';
import validateRequest from '../../middlewares/validateRequest';

export const router = Router();

/**
 * Get all user groups
 */
router.get('/', authorize('admin.groups.read'), controller.getGroups);

/**
 * Create a new user group
 */
router.post(
    '/',
    body('name').not().isEmpty().trim().escape(),
    validateRequest(),
    authorize('admin.groups.write'),
    controller.createGroup
);

/**
 * Get specific group
 */
router.get(
    '/:groupId',
    param('groupId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    authorize('admin.groups.read'),
    controller.getGroup
);

/**
 * Update specific group
 */
router.patch(
    '/:groupId',
    param('groupId').not().isEmpty().isUUID().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    validateRequest(),
    authorize('admin.groups.write'),
    controller.updateGroup
);

/**
 * Delete specific group
 */
router.delete(
    '/:groupId',
    param('groupId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    authorize('admin.groups.delete'),
    controller.deleteGroup
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
    authorize('admin.groups.users.write'),
    controller.addUsersToGroup
);

/**
 * Remove user from specific group
 */
router.delete(
    '/:groupId/users/:userId',
    param('groupId').not().isEmpty().isUUID().trim().escape(),
    param('userId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    authorize('admin.groups.users.delete'),
    controller.removeUserFromGroup
);
