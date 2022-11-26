import { PrismaClient } from '@prisma/client';
import * as IUser from '../interfaces/IUser';
import logger from '../utils/logger';

/**
 * Returns all registered users
 * @param prisma
 * @returns
 */
export const getAllUsers = async (prisma: PrismaClient) => {
    logger.debug('Getting all users');

    const users = await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            country: true,
            company: true
        }
    });

    return users;
};

/**
 * Returns single user
 * @param userId
 * @param prisma
 * @returns
 */
export const getSingleUser = async (userId: string, prisma: PrismaClient) => {
    logger.debug(`Getting user with ID: ${userId}`);

    const user = await prisma.user.findFirst({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            country: true,
            company: true
        },
        where: {
            id: userId
        }
    });

    if (!user) {
        // User not found
        return null;
    }

    return user;
};

/**
 * Updates data of single user
 * @param userId
 * @param patchedUser
 * @param prisma
 * @returns
 */
export const updateSingleUser = async (
    userId: string,
    patchedUser: IUser.PatchSingleUser,
    prisma: PrismaClient
) => {
    logger.debug(`Updating user with ID: ${userId}`);

    const user = await prisma.user.findFirst({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            country: true,
            company: true
        },
        where: {
            id: userId
        }
    });

    if (!user) {
        // User not found
        return null;
    }

    const updatedUser = await prisma.user.update({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            country: true,
            company: true
        },
        where: {
            id: userId
        },
        data: {
            email: patchedUser.email,
            firstName: patchedUser.firstName,
            lastName: patchedUser.lastName,
            country: patchedUser.country,
            company: patchedUser.company
        }
    });

    return updatedUser;
};

/**
 * Deletes single user and removes it from groups
 * @param userId
 * @param prisma
 * @returns
 */
export const deleteSingleUser = async (
    userId: string,
    prisma: PrismaClient
) => {
    logger.debug(`Deleting user with ID: ${userId}`);

    const user = await prisma.user.findFirst({
        select: {
            id: true
        },
        where: {
            id: userId
        }
    });

    if (!user) {
        // User not found
        return null;
    }

    // Check if user in groups
    const groupsUserIn = await prisma.usersInGroups.findMany({
        where: {
            userId: userId
        }
    });

    if (groupsUserIn.length !== 0) {
        // User is in groups, remove user from those groups
        await prisma.usersInGroups.deleteMany({
            where: {
                userId: userId
            }
        });
    }

    // Remove user
    await prisma.user.delete({
        where: {
            id: userId
        }
    });

    return true;
};
