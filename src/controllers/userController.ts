import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import * as responses from '../utils/responses';

export const logInLocalUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token: string | undefined = res.Token;

        if (!token) {
            return responses.internalServerError(req, res);
        }

        return responses.ok(req, res, { token });
    } catch (err: unknown) {
        logger.error('Unknown error occured');
        next(err);
    }
};

export const signUpLocalUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.User;

        if (!user) {
            return responses.internalServerError(req, res);
        }

        return responses.created(req, res, { email: user.email });
    } catch (err: unknown) {
        logger.error('Unknown error occured');
        next(err);
    }
};
