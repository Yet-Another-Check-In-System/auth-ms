import { Router } from 'express';
import { body } from 'express-validator';

import * as userController from '../../controllers/userController';
import loginLocal from '../../middlewares/localLogin';
import signupLocal from '../../middlewares/signupLocal';
import validateRequest from '../../middlewares/validateRequest';
import writeJwt from '../../middlewares/writeJwt';
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
    writeJwt(),
    userController.logInLocalUser
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
 * Register
 */
router.post(
    '/signup',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('firstname').not().isEmpty(),
    body('lastname').not().isEmpty(),
    body('country').not().isEmpty(),
    body('company').not().isEmpty(),
    validateRequest(),
    signupLocal(),
    userController.signUpLocalUser
);
