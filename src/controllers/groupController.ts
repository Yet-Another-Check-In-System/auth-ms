import { NextFunction, Request, Response } from 'express';

import * as groupService from '../services/groupService';
import logger from '../utils/logger';
import prisma from '../utils/prismaHandler';
import * as responses from '../utils/responses';

export const createNewGroup = async (
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
        const groupId = req.query.groupId as string;
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
