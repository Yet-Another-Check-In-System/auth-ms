import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import * as userService from '../services/userService';
import * as responses from '../utils/responses';

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
            const user = await userService.verifyLocalLogin(email, password);

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
        } catch (err) {
            logger.error(`Could not login: ${err}`);
            next(err);
        }
    };

    return middleware;
};

export default localLogin;
