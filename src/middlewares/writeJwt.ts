import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

const writeJwt = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = req.User;

            if (!user) {
                throw new Error('User not set correctly');
            }

            const secret = process.env.JWT_SECRET;
            logger.debug(`JWT_SECRET: ${secret}`);

            if (!secret) {
                throw new Error(
                    'Could not login due to JWT_SECRET not being set'
                );
            }

            const id = user.id;
            delete user.id;

            const token = jwt.sign(user, secret, {
                audience: ['yacis:auth', 'yacis:checkin', 'yacis:admin'],
                issuer: 'yacis:auth',
                subject: id,
                expiresIn: '12h'
            });

            res.Token = token;
            next();
        } catch (err: unknown) {
            logger.error(err);
            next(err);
        }
    };

    return middleware;
};

export default writeJwt;
