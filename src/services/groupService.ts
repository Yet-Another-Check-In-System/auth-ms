import { PrismaClient } from '@prisma/client';
import _ from 'lodash';

import * as IGroupService from '../interfaces/IGroupService';
import logger from '../utils/logger';

/**
 * Create new group
 * @param name
 * @param prisma
 * @returns
 */
export const createGroup = async (name: string, prisma: PrismaClient) => {
    logger.debug('Creating new user group');

    const group = await prisma.group.create({
        data: {
            name: name
        }
    });

    const newGroupData: IGroupService.singleGroup = {
        id: group.id,
        name: group.name,
        users: []
    };

    return newGroupData;
};

/**
 * Get single group
 * @param groupId
 * @param prisma
 * @returns
 */
export const getGroup = async (groupId: string, prisma: PrismaClient) => {
    logger.debug(`Getting group with ID: ${groupId}`);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId
        },
        include: {
            UsersInGroups: {
                select: {
                    userId: true
                },
                where: {
                    groupId: groupId
                }
            }
        }
    });

    if (!group) {
        // Group not found
        return null;
    }

    const result: IGroupService.singleGroup = {
        id: group.id,
        name: group.name,
        users: _.map(group.UsersInGroups, (x) => x.userId)
    };

    return result;
};

/**
 * List all groups
 * @param prisma
 * @returns
 */
export const getGroups = async (prisma: PrismaClient) => {
    logger.debug('Getting all groups');

    const group = await prisma.group.findMany({});

    return _.map(group, (x) => {
        return {
            id: x.id,
            name: x.name
        };
    });
};

/**
 * Update single group
 * @param groupId
 * @param newName
 * @param prisma
 * @returns
 */
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

    const updatedGroup = await prisma.group.update({
        where: {
            id: groupId
        },
        data: {
            name: newName
        }
    });

    const updatedGroupData: IGroupService.GroupWithoutUsers = {
        id: updatedGroup.id,
        name: updatedGroup.name
    };

    return updatedGroupData;
};

/**
 * Delete single group if its empty
 * @param groupId
 * @param prisma
 * @returns
 */
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
        return false;
    }

    await prisma.group.delete({
        where: {
            id: groupId
        }
    });

    return true;
};

/**
 * Add array of users to a single group
 * @param groupId
 * @param userIds
 * @param prisma
 * @param callerId
 * @returns
 */
export const addUsersToGroup = async (
    groupId: string,
    userIds: string[],
    prisma: PrismaClient,
    callerId?: string
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
        return false;
    }

    await prisma.usersInGroups.createMany({
        data: _.map(userIds, (id) => {
            return {
                userId: id,
                groupId: groupId,
                assignedBy: callerId
            };
        })
    });

    const result: IGroupService.singleGroup = {
        id: group.id,
        name: group.name,
        users: userIds
    };

    return result;
};

/**
 * Remove single user from a group
 * @param groupId
 * @param userId
 * @param prisma
 * @returns
 */
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
