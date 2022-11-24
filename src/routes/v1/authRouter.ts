import { Router } from 'express';
import { body } from 'express-validator';

import * as userController from '../../controllers/authController';
import loginLocal from '../../middlewares/localLogin';
import validateRequest from '../../middlewares/validateRequest';
import * as responses from '../../utils/responses';

export const router = Router();

/**
 * Login
 */
router.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    validateRequest(),
    loginLocal(),
    userController.logIn
);

/**
 * Login with Apple
 */
router.post('/login/apple', responses.notImplemented);

/**
 * Login with Google
 */
router.post('/login/google', responses.notImplemented);

/**
 * Login with Microsoft
 */
router.post('/login/microsoft', responses.notImplemented);

/**
 * Sign up
 */
router.post(
    '/signup',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('firstname').not().isEmpty().trim().escape(),
    body('lastname').not().isEmpty().trim().escape(),
    body('country').not().isEmpty().trim().escape().isISO31661Alpha2(),
    body('company').not().isEmpty().trim().escape(),
    validateRequest(),
    userController.signUpLocalUser
);
