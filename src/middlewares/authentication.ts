import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { TokenPayload } from '../interfaces/IAuth';
import * as authService from '../services/authService';
import logger from '../utils/logger';
import prisma from '../utils/prismaHandler';
import * as responses from '../utils/responses';

/**
 * Authenticate user
 * @returns
 */
export const authenticate = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error('JWT_SECRET not set');
            }

            const header = req.headers.authorization;

            if (!header) {
                return responses.unauthorized(req, res);
            }

            const method = header.split(' ')[0];
            const token = header.split(' ')[1];

            if (method !== 'Bearer' || !token) {
                return responses.unauthorized(req, res);
            }

            try {
                const tokenPayload = jwt.verify(token, jwtSecret, {
                    audience: 'yacis:auth',
                    issuer: 'yacis:auth'
                }) as TokenPayload;

                req.TokenPayload = tokenPayload;
            } catch {
                return responses.unauthorized(req, res);
            }

            next();
        } catch (err: unknown) {
            logger.error(err);
            next(err);
        }
    };

    return middleware;
};

/**
 * Authorize user to access a resource
 * @param requiredPermission Require this permission to access resource, can have wildcards ('*')
 * @returns
 */
export const authorize = (requiredPermission: string) => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = req.TokenPayload;

            if (!user || !user.sub) {
                throw new Error(
                    'Request.User not set correctly! Was authenticate called before this function?'
                );
            }

            const [isAllowed] = await authService.authorize(
                user.sub,
                requiredPermission,
                prisma
            );

            if (!isAllowed) {
                return responses.forbidden(req, res);
            }

            next();
        } catch (err: unknown) {
            logger.error(err);
            next(err);
        }
    };

    return middleware;
};

/**
 * Authorize user to access a resource
 * If basic user requires, requestedId to match
 * @param requiredPermission Require this permission to access resource, can have wildcards ('*')
 * @returns
 */
export const authorizeSelf = (requiredPermission: string) => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = req.TokenPayload;
            const requestedId = req.params.userId;

            if (!user || !user.sub) {
                throw new Error(
                    'Request.User not set correctly! Was authenticate called before this function?'
                );
            }

            if (!requestedId) {
                return responses.badRequest(req, res);
            }

            const [isAllowed, matchedPermissions] = await authService.authorize(
                user.sub,
                requiredPermission,
                prisma
            );

            if (!isAllowed) {
                return responses.forbidden(req, res);
            }

            const matchedTypes = _.map(
                matchedPermissions,
                (m) => m.split('.')[0]
            );

            // Require admin rights for different userId
            if (requestedId !== user.sub) {
                const isAdmin = matchedTypes.includes('admin');

                if (!isAdmin) {
                    return responses.forbidden(req, res);
                }
            }

            next();
        } catch (err: unknown) {
            logger.error(err);
            next(err);
        }
    };

    return middleware;
};
