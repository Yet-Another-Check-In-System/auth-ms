import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import logger from '../utils/logger';
import * as responses from '../utils/responses';

const validateRequest = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!validationResult(req).isEmpty()) {
                logger.warn('Request contained invalid values');
                return responses.badRequest(req, res);
            }

            next();
        } catch (err: unknown) {
            logger.error(err);
            next(err);
        }
    };

    return middleware;
};

export default validateRequest;
