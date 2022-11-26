import { NextFunction, Request, Response } from 'express';

import { checkHealth } from '../services/healthService';
import logger from '../utils/logger';
import prisma from '../utils/prismaHandler';
import * as responses from '../utils/responses';

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const healthStatus = await checkHealth(prisma);
        return responses.ok(req, res, healthStatus);
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};
