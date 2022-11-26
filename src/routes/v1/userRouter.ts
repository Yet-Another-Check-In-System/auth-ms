import { Router } from 'express';

import { body, param } from 'express-validator';
import * as userController from '../../controllers/userController';
import validateRequest from '../../middlewares/validateRequest';

export const router = Router();

/**
 * Get all users
 * Requires admin
 */
router.get('/', userController.getAllUsers);

/**
 * Get single user
 * User can request data of themselves
 * for others admin is required
 */
router.get(
    '/:userId',
    param('userId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    userController.getSingleUser
);

/**
 * Update user data
 * User can change data of themselves
 * for others admin is required
 */
router.patch(
    '/:userId',
    param('userId').not().isEmpty().isUUID().trim().escape(),
    body('email').optional({ nullable: true }).isEmail().trim().escape(),
    body('firstName').optional({ nullable: true }).trim().escape(),
    body('lastName').optional({ nullable: true }).trim().escape(),
    body('country')
        .optional({ nullable: true })
        .isISO31661Alpha2()
        .trim()
        .escape(),
    body('company').optional({ nullable: true }).trim().escape(),
    validateRequest(),
    userController.updateSingleUser
);

/**
 * Delete user
 * User can queue their account to be deleted in 24 hours
 * Admin can delete any account
 */
router.delete(
    '/:userId',
    param('userId').not().isEmpty().isUUID().trim().escape(),
    validateRequest(),
    userController.deleteSingleUser
);
