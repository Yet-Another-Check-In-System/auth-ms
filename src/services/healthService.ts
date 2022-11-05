import { PrismaClientInitializationError } from '@prisma/client/runtime';
import logger from '../utils/logger';
import { IHealthService } from '../interfaces/IHealthService';
import prisma from '../utils/prismaHandler';

export const checkHealth = async (): Promise<IHealthService> => {
    try {
        // Test the connection to the database
        logger.debug('Checking health of database');
        await prisma.user.findFirst();
        logger.debug('Check for database health was successful');

        return {
            server: true,
            database: true
        };
    } catch (e: unknown) {
        logger.error('Unable to reach database');

        if (e instanceof PrismaClientInitializationError) {
            logger.error(e.message);
        }

        return {
            server: true,
            database: false
        };
    }
};
