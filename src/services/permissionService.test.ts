import { Group, Permission, User, UsersInGroups } from '@prisma/client';
import { prismaMock } from '../utils/prismaMock';
import * as service from './permissionService';

jest.mock('../utils/logger');

describe('permissionService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getAllPermissions', () => {
        it('Should return all permissions', async () => {
            const permissions = [
                {
                    id: '217cee1e-bbd9-4f9a-9127-9414da2eef98',
                    name: 'admin.test.first'
                },
                {
                    id: '217cee1e-bbd9-4f9a-9127-9414da2eef98',
                    name: 'admin.test.second'
                }
            ];

            prismaMock.permission.findMany.mockResolvedValueOnce(
                permissions as Permission[]
            );

            const res = await service.getAllPermissions(prismaMock);

            expect(res).toEqual(permissions);
        });

        it('Should return empty array when no permissions found', async () => {
            prismaMock.permission.findMany.mockResolvedValueOnce([]);

            const res = await service.getAllPermissions(prismaMock);

            expect(res).toEqual([]);
        });

        it('Should not handle any errors', async () => {
            prismaMock.permission.findMany.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(() =>
                service.getAllPermissions(prismaMock)
            ).rejects.toThrowError('test error');
        });
    });

    describe('getUserPermission', () => {
        it('Should return all permissions of the user', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce({
                id: '1df88213-ef68-47b4-87a8-936d7f94366f'
            } as User);
            prismaMock.usersInGroups.findMany.mockResolvedValueOnce([
                {
                    groupId: '01fcc9ab-6960-44fd-ba06-19560787f3f1'
                },
                {
                    groupId: '1e585282-dd9a-4e70-a715-8fd0b9636ee7'
                }
            ] as UsersInGroups[]);
            prismaMock.groupPermissions.findMany.mockResolvedValueOnce([
                {
                    permission: {
                        id: '9b0b9c62-cdc2-4298-b34d-3fe5328bacc9',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: 'admin.test.first'
                    }
                },
                {
                    permission: {
                        id: '24cc57d4-d411-4e64-b79c-18e27b96747e',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: 'admin.test.second'
                    }
                },
                {
                    permission: {
                        id: '42637c9a-6e08-4b86-8e6e-b374953dc6ed',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: 'admin.test.first'
                    }
                }
            ] as never);

            const res = await service.getUserPermission(
                '1df88213-ef68-47b4-87a8-936d7f94366f',
                prismaMock
            );

            expect(res).toEqual(['admin.test.first', 'admin.test.second']);
        });

        it('Should return null when the user is not found', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(null);

            const res = await service.getUserPermission(
                '1df88213-ef68-47b4-87a8-936d7f94366f',
                prismaMock
            );

            expect(res).toBeNull();
        });

        it('Should not handle any errors', async () => {
            prismaMock.user.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(() =>
                service.getUserPermission(
                    '1df88213-ef68-47b4-87a8-936d7f94366f',
                    prismaMock
                )
            ).rejects.toThrowError('test error');
        });
    });

    describe('getGroupPermission', () => {
        it('Should return null when the group is not found', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce(null);

            const res = await service.getGroupPermission(
                '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                prismaMock
            );

            expect(res).toEqual(null);
        });

        it('Should return all permissions for the group', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce({
                id: '5ad3173d-ccfb-4a68-9b7c-d148bde4272c'
            } as Group);
            prismaMock.groupPermissions.findMany.mockResolvedValueOnce([
                {
                    permission: {
                        id: '9b0b9c62-cdc2-4298-b34d-3fe5328bacc9',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: 'admin.test.first'
                    }
                },
                {
                    permission: {
                        id: '24cc57d4-d411-4e64-b79c-18e27b96747e',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: 'admin.test.second'
                    }
                }
            ] as never);

            const res = await service.getGroupPermission(
                '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                prismaMock
            );

            expect(res).toEqual(['admin.test.first', 'admin.test.second']);
        });

        it('Should not handle any errors', async () => {
            prismaMock.group.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(() =>
                service.getGroupPermission(
                    '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                    prismaMock
                )
            ).rejects.toThrowError('test error');
        });
    });

    describe('addPermissionsToGroup', () => {
        it('Should return true when called with empty array of permissions', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce(null);

            const res = await service.addPermissionsToGroup(
                '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                [],
                '9cd50d25-622a-415c-909b-cf951bef6db3',
                prismaMock
            );

            expect(res).toEqual(true);
        });

        it('Should return null when the group is not found', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce(null);

            const res = await service.addPermissionsToGroup(
                '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                ['d4e211f3-7b8d-4f72-b4f2-b10401d482dd'],
                '9cd50d25-622a-415c-909b-cf951bef6db3',
                prismaMock
            );

            expect(res).toBeNull();
        });

        it('Should return null when all given permissions dont exist', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce({
                id: '5ad3173d-ccfb-4a68-9b7c-d148bde4272c'
            } as Group);
            prismaMock.permission.findMany.mockResolvedValueOnce([
                {
                    id: 'd4e211f3-7b8d-4f72-b4f2-b10401d482dd'
                }
            ] as Permission[]);

            const res = await service.addPermissionsToGroup(
                '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                [
                    'd4e211f3-7b8d-4f72-b4f2-b10401d482dd',
                    'b8742c40-480c-40fa-abad-16776e0bfb1c'
                ],
                '9cd50d25-622a-415c-909b-cf951bef6db3',
                prismaMock
            );

            expect(res).toBeNull();
        });

        it('Should return true when permissions are added successfully', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce({
                id: '5ad3173d-ccfb-4a68-9b7c-d148bde4272c'
            } as Group);
            prismaMock.permission.findMany.mockResolvedValueOnce([
                {
                    id: 'd4e211f3-7b8d-4f72-b4f2-b10401d482dd'
                },
                {
                    id: 'b8742c40-480c-40fa-abad-16776e0bfb1c'
                }
            ] as Permission[]);

            const res = await service.addPermissionsToGroup(
                '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                [
                    'd4e211f3-7b8d-4f72-b4f2-b10401d482dd',
                    'b8742c40-480c-40fa-abad-16776e0bfb1c'
                ],
                '9cd50d25-622a-415c-909b-cf951bef6db3',
                prismaMock
            );

            expect(res).toEqual(true);
        });

        it('Should not handle any errors', async () => {
            prismaMock.group.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(() =>
                service.addPermissionsToGroup(
                    '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                    ['d4e211f3-7b8d-4f72-b4f2-b10401d482dd'],
                    '9cd50d25-622a-415c-909b-cf951bef6db3',
                    prismaMock
                )
            ).rejects.toThrowError('test error');
        });
    });

    describe('removePermissionsFromGroup', () => {
        it('Should return true if called with no permissions', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce(null);

            const res = await service.removePermissionsFromGroup(
                '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                [],
                prismaMock
            );

            expect(res).toEqual(true);
        });

        it('Should return null if the group not found', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce(null);

            const res = await service.removePermissionsFromGroup(
                '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                ['f5c27f6f-0c92-4f69-a461-d0ce5adb2df3'],
                prismaMock
            );

            expect(res).toBeNull();
        });

        it('Should return true when permissions are removed successfully', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce({
                id: '5ad3173d-ccfb-4a68-9b7c-d148bde4272c'
            } as Group);

            const res = await service.removePermissionsFromGroup(
                '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                ['f5c27f6f-0c92-4f69-a461-d0ce5adb2df3'],
                prismaMock
            );

            expect(res).toEqual(true);
        });

        it('Should not handle any errors', async () => {
            prismaMock.group.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(() =>
                service.removePermissionsFromGroup(
                    '5ad3173d-ccfb-4a68-9b7c-d148bde4272c',
                    ['8af50c8d-d8e8-465c-a599-ba659136efa9'],
                    prismaMock
                )
            ).rejects.toThrowError('test error');
        });
    });
});
