import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import * as userService from '../services/authService';
import * as responses from '../utils/responses';
import prisma from '../utils/prismaHandler';

const localLogin = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const email = req.body.email;
            const password = req.body.password;

            // Try to verify user
            const user = await userService.verifyLocalLogin(
                email,
                password,
                prisma
            );

            if (!user) {
                return responses.unauthorized(
                    req,
                    res,
                    'Incorrect email or password.'
                );
            }

            // Set user to request
            req.User = user;

            next();
        } catch (err: unknown) {
            logger.error(err);
            next(err);
        }
    };

    return middleware;
};

export default localLogin;
