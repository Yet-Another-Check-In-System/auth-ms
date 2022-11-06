import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import logger from '../utils/logger';
import * as responses from '../utils/responses';

const validateRequest = () => {
    const middleware = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            logger.warn('Request contained invalid values');
            return responses.badRequest(req, res);
        }

        next();
    };

    return middleware;
};

export default validateRequest;
