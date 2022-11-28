import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

import { SignupLocalUser } from '../interfaces/IAuth';
import * as service from '../services/authService';
import logger from '../utils/logger';
import prisma from '../utils/prismaHandler';
import * as responses from '../utils/responses';

export const logIn = async (
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
            throw new Error('JWT_SECRET not set correctly');
        }

        const id = user.id;
        delete user.id;

        const tokenExpiration = DateTime.utc().plus({ hours: 12 });
        const token = jwt.sign(
            { ...user, exp: tokenExpiration.toSeconds() },
            secret,
            {
                audience: ['yacis:auth', 'yacis:checkin', 'yacis:admin'],
                issuer: 'yacis:auth',
                subject: id
            }
        );

        return responses.ok(req, res, {
            token,
            expiresAt: tokenExpiration.toISO()
        });
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};

export const signUpLocalUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const body: SignupLocalUser = req.body;

        // Try to create user
        const user = await service.signupLocal(body, prisma);

        if (!user) {
            return responses.badRequest(
                req,
                res,
                'The email is already associated with an account.'
            );
        }

        return responses.created(req, res, { id: user.id, email: user.email });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};
