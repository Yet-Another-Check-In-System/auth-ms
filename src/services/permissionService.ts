import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import _ from 'lodash';

/**
 * Get permissions of a single user
 * e.g. all permissions gained from groups
 * @param userId
 * @param prisma
 * @returns
 */
export const getUserPermission = async (
    userId: string,
    prisma: PrismaClient
) => {
    // Check user exists
    const user = await prisma.user.findFirst({
        select: {
            id: true
        },
        where: {
            id: userId
        }
    });

    if (!user) {
        // User doesn't exist
        return null;
    }

    // Check groups user is in
    const groups = await prisma.usersInGroups.findMany({
        select: {
            groupId: true
        },
        where: {
            userId: userId
        }
    });

    const groupIds = _.map(groups, (g) => g.groupId);

    // Get permissions for those groups
    const permissions = await prisma.groupPermissions.findMany({
        select: {
            permission: true
        },
        where: {
            groupId: {
                in: groupIds
            }
        }
    });

    const permissionArray = _.map(permissions, (p) => p.permission);

    // Combine permissions and return them
    const uniquePermissions = _.uniqBy(permissionArray, (x) => x.name);

    return uniquePermissions;
};

/**
 * Get all permissions linked to a single group
 * @param groupId
 * @param prisma
 * @returns
 */
export const getGroupPermission = async (
    groupId: string,
    prisma: PrismaClient
) => {
    // Check group exists
    const group = await prisma.group.findFirst({
        select: {
            id: true
        },
        where: {
            id: groupId
        }
    });

    if (!group) {
        // Group not found
        return null;
    }

    // Get permissions for group
    const permissionObjectArray = await prisma.groupPermissions.findMany({
        select: {
            permission: true
        },
        where: {
            groupId: groupId
        }
    });

    const permissions = _.map(permissionObjectArray, (x) => x.permission);

    // Return them
    return permissions;
};

/**
 * Link given permissions to a group
 * @param groupId
 * @param permissions
 * @param callerId
 * @param prisma
 * @returns
 */
export const addPermissionsToGroup = async (
    groupId: string,
    permissions: string[],
    callerId: string,
    prisma: PrismaClient
) => {
    const group = await prisma.group.findFirst({
        select: {
            id: true
        },
        where: {
            id: groupId
        }
    });

    // Group not found
    if (!group) {
        return null;
    }

    // Check that linked permissions exist
    const dbPermissions = await prisma.permission.findMany({
        select: {
            id: true
        },
        where: {
            id: {
                in: permissions
            }
        }
    });

    // All permissions not found
    if (dbPermissions.length !== permissions.length) {
        return null;
    }

    try {
        await prisma.groupPermissions.createMany({
            data: _.map(dbPermissions, (p) => {
                return {
                    groupId: groupId,
                    permissionId: p.id,
                    assignedBy: callerId
                };
            }),
            skipDuplicates: true
        });
    } catch (err: unknown) {
        // Duplicate entry
        if (err instanceof PrismaClientKnownRequestError) {
            return false;
        } else {
            throw err;
        }
    }

    return true;
};

/**
 * Remove given permissions from the group
 * @param groupId
 * @param permissions
 * @param prisma
 */
export const removePermissionsFromGroup = async (
    groupId: string,
    permissions: string[],
    prisma: PrismaClient
) => {
    const group = await prisma.group.findFirst({
        select: {
            id: true
        },
        where: {
            id: groupId
        }
    });

    if (!group) {
        // Group not found
        return null;
    }

    await prisma.groupPermissions.deleteMany({
        where: {
            groupId: groupId,
            permissionId: {
                in: permissions
            }
        }
    });

    return true;
};