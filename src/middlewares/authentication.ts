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
 *
 * If the parameters contain "userId", the subject field of
 * the token needs to match the "userId" parameter if the caller
 * doesn't have admin privileges for the operation.
 *
 * @param requiredPermission Require this permission to access resource,
 * can have wildcards e.g. "*.permissions.read"
 * @param skipUserIdCheck When true skips the userId checks
 * @returns
 */
export const authorize = (
    requiredPermission: string,
    skipUserIdCheck = false
) => {
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

            const matchedPermissions = await authService.authorize(
                user.sub,
                requiredPermission,
                prisma
            );

            if (matchedPermissions.length === 0) {
                return responses.forbidden(req, res);
            }

            if (req.params.userId && !skipUserIdCheck) {
                const requestedId = req.params.userId;

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
            }

            next();
        } catch (err: unknown) {
            logger.error(err);
            next(err);
        }
    };

    return middleware;
};
