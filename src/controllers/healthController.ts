import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import { checkHealth } from '../services/healthService';
import * as responses from '../utils/responses';
import prisma from '../utils/prismaHandler';

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const healthStatus = await checkHealth(prisma);
        return responses.ok(req, res, healthStatus);
    } catch (err: unknown) {
        logger.error(err);
        next(err);
    }
};
