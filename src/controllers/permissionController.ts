import { NextFunction, Request, Response } from 'express';

import * as service from '../services/permissionService';
import logger from '../utils/logger';
import prisma from '../utils/prismaHandler';
import * as responses from '../utils/responses';

export const getUserPermission = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.params.userId as string;
        const userPermissions = await service.getUserPermission(userId, prisma);

        if (!userPermissions) {
            return responses.notFound(req, res);
        }

        return responses.ok(req, res, {
            id: userId,
            permissions: userPermissions
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const getGroupPermission = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const groupId = req.params.groupId as string;
        const groupPermissions = await service.getGroupPermission(
            groupId,
            prisma
        );

        if (!groupPermissions) {
            return responses.notFound(req, res);
        }

        return responses.ok(req, res, {
            id: groupId,
            permissions: groupPermissions
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const addPermissionsToGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const groupId = req.params.groupId as string;
        const permissions = req.body as string[];
        const callerId = ''; // When authorization is done, add userId here

        const response = await service.addPermissionsToGroup(
            groupId,
            permissions,
            callerId,
            prisma
        );

        if (!response) {
            return responses.notFound(req, res);
        }

        const groupPermissions = (await service.getGroupPermission(
            groupId,
            prisma
        )) as string[];

        return responses.ok(req, res, {
            id: groupId,
            permissions: groupPermissions
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const removePermissionsFromGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const groupId = req.params.groupId as string;
        const permissions = req.body as string[];

        const response = await service.removePermissionsFromGroup(
            groupId,
            permissions,
            prisma
        );

        if (!response) {
            return responses.notFound(req, res);
        }

        const groupPermissions = (await service.getGroupPermission(
            groupId,
            prisma
        )) as string[];

        return responses.ok(req, res, {
            id: groupId,
            permissions: groupPermissions
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const getAllPermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const permissions = await service.getAllPermissions(prisma);

        return responses.ok(req, res, {
            permissions: permissions
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};
