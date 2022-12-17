/**
 * Modify and get permissions of a user
 */
import { Router } from 'express';
import { body, param } from 'express-validator';

import * as controller from '../../controllers/permissionController';
import { authorize, authorizeSelf } from '../../middlewares/authentication';
import validateRequest from '../../middlewares/validateRequest';

export const router = Router();

/**
 * Get all available permissions
 * Requires admin authentication
 */
router.get(
    '/',
    authorize('admin.permissions.read'),
    controller.getAllPermissions
);

/**
 * Get all permissions for user
 * Requires admin authentication for other users
 */
router.get(
    '/users/:userId',
    param('userId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    authorizeSelf('*.permissions.read'),
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
    authorize('admin.permissions.read'),
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
    authorize('admin.permissions.write'),
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
    authorize('admin.permissions.delete'),
    controller.removePermissionsFromGroup
);
