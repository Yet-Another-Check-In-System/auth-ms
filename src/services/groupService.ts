import { PrismaClient } from '@prisma/client';

import { UserGroupService } from '../interfaces/IGroupService';
import logger from '../utils/logger';

export const createGroup = async (name: string, prisma: PrismaClient) => {
    logger.debug('Creating new user group');

    const group = await prisma.group.create({
        data: {
            name: name
        }
    });

    const newGroupData: UserGroupService = {
        name: group.name,
        users: []
    };

    return newGroupData;
};

export const getGroup = async (groupId: string, prisma: PrismaClient) => {
    logger.debug(`Getting group with ID: ${groupId}`);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId
        }
    });

    return group;
};
