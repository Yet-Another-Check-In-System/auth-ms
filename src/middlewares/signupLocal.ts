import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import * as userService from '../services/authService';
import * as responses from '../utils/responses';
import { SignupLocalUser } from '../interfaces/IAuthService';
import prisma from '../utils/prismaHandler';

const signupLocal = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const body: SignupLocalUser = req.body;

            // Try to create user
            const user = await userService.signupLocal(body, prisma);

            if (!user) {
                return responses.badRequest(
                    req,
                    res,
                    'The email is already associated with an account.'
                );
            }

            // Set user to request
            req.User = user;

            next();
        } catch (err) {
            logger.error(err);
            next(err);
        }
    };

    return middleware;
};

export default signupLocal;
