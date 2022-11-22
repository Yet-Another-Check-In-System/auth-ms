import { PrismaClient } from '@prisma/client';
import _ from 'lodash';
import { DateTime } from 'luxon';

import logger from './logger';
import prisma from './prismaHandler';

/**
 * Clean expired user data once every day
 */
export const scheduledCleaning = () => {
    runClean(prisma);

    setInterval(() => runClean(prisma), 86400000);
};

/**
 * Cleans all the expired user datas from database
 */
export const runClean = async (prisma: PrismaClient) => {
    const currentTime = DateTime.utc();

    // Find all expired
    const expiredAccounts = await prisma.user.findMany({
        where: {
            expireAt: {
                lte: currentTime.toJSDate()
            }
        }
    });

    if (expiredAccounts.length === 0) {
        logger.warn('No expired accounts to delete');

        return await prisma.cleanUp.create({
            data: {
                removedAmount: 0
            }
        });
    }

    // Create map with expired IDs
    const expiredIds = _.map(expiredAccounts, (x) => x.id);

    // Remove all user group connections
    await prisma.usersInGroups.deleteMany({
        where: {
            userId: {
                in: expiredIds
            }
        }
    });

    // Remove users
    await prisma.user.deleteMany({
        where: {
            id: {
                in: expiredIds
            }
        }
    });

    // Write to clean up log
    await prisma.cleanUp.create({
        data: {
            removedAmount: expiredIds.length
        }
    });
};
