import { PrismaClient } from '@prisma/client';
import _ from 'lodash';

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

export const getGroups = async (prisma: PrismaClient) => {
    logger.debug('Getting all groups');

    const group = await prisma.group.findMany({});

    return group;
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

export const updateGroup = async (
    groupId: string,
    newName: string,
    prisma: PrismaClient
) => {
    logger.debug(`Updating group with ID: ${groupId}`);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId
        }
    });

    if (!group) {
        // Group not found
        return null;
    }

    const newGroup = await prisma.group.update({
        where: {
            id: groupId
        },
        data: {
            name: newName
        }
    });

    return newGroup;
};

export const deleteGroup = async (groupId: string, prisma: PrismaClient) => {
    logger.debug(`Deleting group with ID: ${groupId}`);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId
        }
    });

    if (!group) {
        // Group not found
        return null;
    }

    // Check if there are any users in the group
    const users = await prisma.usersInGroups.findMany({
        where: {
            groupId: groupId
        }
    });

    if (users.length > 0) {
        // Users in group
        return null;
    }

    await prisma.group.delete({
        where: {
            id: groupId
        }
    });

    return true;
};

export const addUsersToGroup = async (
    groupId: string,
    userIds: string[],
    prisma: PrismaClient,
    calledId?: string
) => {
    logger.debug(`Deleting group with ID: ${groupId}`);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId
        }
    });

    if (!group) {
        // Group not found
        return null;
    }

    // Check that all users exists
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: userIds
            }
        }
    });

    if (userIds.length !== users.length) {
        // Not all users exist
        return null;
    }

    const usersAndGroups = _.map(userIds, (id) => {
        return {
            userId: id,
            groupId: groupId,
            assignedBy: calledId
        };
    });

    await prisma.usersInGroups.createMany({
        data: usersAndGroups
    });

    return true;
};

export const removeUserFromGroup = async (
    groupId: string,
    userId: string,
    prisma: PrismaClient
) => {
    logger.debug(
        `Removing user with id: ${userId} from group with id: ${groupId}`
    );

    const userInGroup = await prisma.usersInGroups.findFirst({
        where: {
            groupId: groupId,
            userId: userId
        }
    });

    if (!userInGroup) {
        // User not a member of group
        return null;
    }

    await prisma.usersInGroups.delete({
        where: {
            userId_groupId: {
                userId: userId,
                groupId: groupId
            }
        }
    });

    return true;
};
