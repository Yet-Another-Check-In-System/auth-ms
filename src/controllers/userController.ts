import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

import * as userService from '../services/userService';
import * as IUser from '../interfaces/IUser';
import * as responses from '../utils/responses';
import prisma from '../utils/prismaHandler';

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await userService.getAllUsers(prisma);

        return responses.ok(req, res, { users: users });
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};

export const getSingleUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.query.userId as string;
        const user = await userService.getSingleUser(userId, prisma);

        if (!user) {
            // User not found
            return responses.notFound(req, res);
        }

        return responses.ok(req, res, { user: user });
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};

export const updateSingleUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.query.userId as string;
        const body = req.body as IUser.PatchSingleUser;

        const updatedUser = await userService.updateSingleUser(
            userId,
            body,
            prisma
        );

        if (!updatedUser) {
            // User not found
            return responses.notFound(req, res);
        }

        return responses.ok(req, res, { user: updatedUser });
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};

export const deleteSingleUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.query.userId as string;
        const result = await userService.deleteSingleUser(userId, prisma);

        if (!result) {
            // User not found
            return responses.notFound(req, res);
        }

        return responses.noContent(req, res);
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};
