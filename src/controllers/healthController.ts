import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import { checkHealth } from '../services/healthService';

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const healthStatus = await checkHealth();
        return res.json(healthStatus);
    } catch (err: unknown) {
        logger.error('Unknown error occured');
        next(err);
    }
};
