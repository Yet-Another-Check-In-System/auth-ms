import { NextFunction, Request, Response } from 'express';

import { createGroup } from '../services/groupService';
import logger from '../utils/logger';
import prisma from '../utils/prismaHandler';
import * as responses from '../utils/responses';

export const createNewGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const name: string = req.body.name;
        const createdGroup = await createGroup(name, prisma);

        return responses.created(req, res, createdGroup);
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};
