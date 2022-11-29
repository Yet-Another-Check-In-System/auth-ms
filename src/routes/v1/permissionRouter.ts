/**
 * Modify and get permissions of a user
 */
import { Router } from 'express';
import { body, param } from 'express-validator';

import * as controller from '../../controllers/permissionController';
import validateRequest from '../../middlewares/validateRequest';

export const router = Router();

/**
 * Get all available permissions
 * Requires admin authentication
 */
router.get('/', controller.getAllPermissions);

/**
 * Get all permissions for user
 * Requires admin authentication for other users
 */
router.get(
    '/users/:userId',
    param('userId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    controller.getUserPermission
);

/**
 * Get all permissions for user group
 * Requires admin authentication for other users
 */
router.get(
    '/groups/:groupId',
    param('groupId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    controller.getGroupPermission
);

/**
 * Add permissions for user group
 * Requires admin authentication
 */
router.patch(
    '/groups/:groupId',
    param('groupId').not().isEmpty().isUUID().trim().escape(),
    body().isArray(),
    body('*').isString().isUUID().trim().escape(),
    validateRequest(),
    controller.addPermissionsToGroup
);

/**
 * Delete permissions from user group
 * Requires admin authentication
 */
router.delete(
    '/groups/:groupId',
    param('groupId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    controller.removePermissionsFromGroup
);
