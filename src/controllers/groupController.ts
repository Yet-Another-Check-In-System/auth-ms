import { NextFunction, Request, Response } from 'express';

import * as groupService from '../services/groupService';
import logger from '../utils/logger';
import prisma from '../utils/prismaHandler';
import * as responses from '../utils/responses';

export const createGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const name = req.body.name as string;
        const createdGroup = await groupService.createGroup(name, prisma);

        return responses.created(req, res, createdGroup);
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};

export const getGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const groupId = req.params.groupId as string;
        const foundGroup = await groupService.getGroup(groupId, prisma);

        if (!foundGroup) {
            return responses.notFound(req, res);
        }

        return responses.ok(req, res, foundGroup);
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};

export const getGroups = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const foundGroups = await groupService.getGroups(prisma);

        const response = {
            groups: foundGroups
        };

        return responses.ok(req, res, response);
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};

export const updateGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const groupId = req.params.groupId as string;
        const name = req.body.name as string;
        const updatedGroup = await groupService.updateGroup(
            groupId,
            name,
            prisma
        );

        if (!updatedGroup) {
            return responses.notFound(req, res);
        }

        return responses.ok(req, res, updatedGroup);
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};

export const deleteGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const groupId = req.params.groupId as string;
        const operationSuccessful = await groupService.deleteGroup(
            groupId,
            prisma
        );

        if (operationSuccessful === null) {
            return responses.notFound(req, res);
        }

        // False is returned if there are still users in the group
        if (operationSuccessful === false) {
            return responses.badRequest(req, res);
        }

        return responses.noContent(req, res);
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};

export const addUsersToGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const groupId = req.params.groupId as string;
        const users = req.body as string[];
        const result = await groupService.addUsersToGroup(
            groupId,
            users,
            prisma
        );

        if (result === null) {
            return responses.notFound(req, res);
        }

        // All users don't exist
        if (result === false) {
            return responses.badRequest(req, res);
        }

        return responses.ok(req, res, result);
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};

export const removeUserFromGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const groupId = req.params.groupId as string;
        const userId = req.params.userId as string;
        const operationSuccessful = await groupService.removeUserFromGroup(
            groupId,
            userId,
            prisma
        );

        if (!operationSuccessful) {
            return responses.badRequest(req, res);
        }

        return responses.noContent(req, res);
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};
