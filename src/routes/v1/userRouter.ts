import { Router } from 'express';
import loginLocal from '../../middlewares/localLogin';
import writeJwt from '../../middlewares/writeJwt';
import { body } from 'express-validator';
import validateRequest from '../../middlewares/validateRequest';
import * as userController from '../../controllers/userController';
import * as responses from '../../utils/responses';
import signupLocal from '../../middlewares/signupLocal';

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
    validateRequest(),
    signupLocal(),
    userController.signUpLocalUser
);
