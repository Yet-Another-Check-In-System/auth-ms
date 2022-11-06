import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import * as responses from '../utils/responses';

const writeJwt = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const user = req.User;

        if (!user) {
            return responses.internalServerError(req, res);
        }

        const secret = process.env.JWT_SECRET;
        logger.debug(`JWT_SECRET: ${secret}`);

        if (!secret) {
            logger.crit('Could not login due to JWT_SECRET not being set');
            return next(new Error('Could not login due to an error'));
        }

        const id = user.id;
        delete user.id;

        const token = jwt.sign(user, secret, {
            audience: 'yac.is',
            subject: id,
            expiresIn: '12h'
        });

        res.Token = token;
        next();
    };

    return middleware;
};

export default writeJwt;
