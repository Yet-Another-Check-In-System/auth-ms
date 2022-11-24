import { Group } from '@prisma/client';

import { prismaMock } from '../utils/prismaMock';
import {
    addUsersToGroup,
    createGroup,
    deleteGroup,
    getGroup,
    getGroups,
    removeUserFromGroup,
    updateGroup
} from './groupService';

jest.mock('../utils/logger');

describe('groupService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('createGroup', () => {
        it('Should create a new group', async () => {
            prismaMock.group.create.mockResolvedValueOnce({
                id: 'ee9b3e7d-9303-4371-bada-c4a5dbd91952',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'testName'
            });

            const res = await createGroup('testName', prismaMock);

            expect(prismaMock.group.create).toBeCalledTimes(1);
            expect(res).toEqual({
                id: 'ee9b3e7d-9303-4371-bada-c4a5dbd91952',
                name: 'testName',
                users: []
            });
        });

        it('Should not handle any thrown errors internally', async () => {
            prismaMock.group.create.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(createGroup('testName', prismaMock)).rejects.toThrow(
                'test error'
            );
        });
    });

    describe('getGroups', () => {
        it('Should find all the groups', async () => {
            const groups = [
                {
                    id: 'f2a93269-f534-45fb-afb8-66a416728a01',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'testName 1'
                },
                {
                    id: '7d47ad93-a66b-4090-9995-43ece8987eb9',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'testName 2'
                }
            ];

            prismaMock.group.findMany.mockResolvedValueOnce(groups);

            const res = await getGroups(prismaMock);

            expect(prismaMock.group.findMany).toBeCalledTimes(1);
            expect(res).toEqual([
                {
                    id: 'f2a93269-f534-45fb-afb8-66a416728a01',
                    name: 'testName 1'
                },
                {
                    id: '7d47ad93-a66b-4090-9995-43ece8987eb9',
                    name: 'testName 2'
                }
            ]);
        });

        it('Should return empty array if no groups was found', async () => {
            prismaMock.group.findMany.mockResolvedValueOnce([]);

            const res = await getGroups(prismaMock);

            expect(prismaMock.group.findMany).toBeCalledTimes(1);
            expect(res).toEqual([]);
        });

        it('Should not handle any thrown errors internally', async () => {
            prismaMock.group.findMany.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(getGroups(prismaMock)).rejects.toThrow('test error');
        });
    });

    describe('getGroup', () => {
        it('Should find the group', async () => {
            const group: Group & { UsersInGroups: { userId: string }[] } = {
                id: 'f2a93269-f534-45fb-afb8-66a416728a01',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'testName',
                UsersInGroups: [
                    {
                        userId: '229fbdd5-f448-4744-b081-adaedbd2c626'
                    },
                    {
                        userId: 'fd2f6344-89c9-4275-abc6-bb799b313542'
                    }
                ]
            };

            prismaMock.group.findFirst.mockResolvedValueOnce(group);

            const res = await getGroup(
                'f2a93269-f534-45fb-afb8-66a416728a01',
                prismaMock
            );

            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(res).toEqual({
                id: group.id,
                name: group.name,
                users: [
                    '229fbdd5-f448-4744-b081-adaedbd2c626',
                    'fd2f6344-89c9-4275-abc6-bb799b313542'
                ]
            });
        });

        it('Should return empty user array if no users', async () => {
            const group: Group & { UsersInGroups: { userId: string }[] } = {
                id: 'f2a93269-f534-45fb-afb8-66a416728a01',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'testName',
                UsersInGroups: []
            };

            prismaMock.group.findFirst.mockResolvedValueOnce(group);

            const res = await getGroup(
                'f2a93269-f534-45fb-afb8-66a416728a01',
                prismaMock
            );

            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(res).toEqual({
                id: group.id,
                name: group.name,
                users: []
            });
        });

        it('Should return null if the group was not found', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce(null);

            const res = await getGroup(
                'f2a93269-f534-45fb-afb8-66a416728a01',
                prismaMock
            );

            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(res).toEqual(null);
        });

        it('Should not handle any thrown errors internally', async () => {
            prismaMock.group.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(
                getGroup('f2a93269-f534-45fb-afb8-66a416728a01', prismaMock)
            ).rejects.toThrow('test error');
        });
    });

    describe('updateGroup', () => {
        it('Should return null if group not found', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce(null);

            const res = await updateGroup(
                'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                'new name',
                prismaMock
            );

            expect(res).toBeNull();
            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(prismaMock.group.update).not.toBeCalled();
        });

        it('Should return updated group', async () => {
            let group = {
                id: '0e38cd5a-7f21-4b51-aaa4-bce33527144e',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'old name'
            };

            prismaMock.group.findFirst.mockResolvedValueOnce(group);

            group = {
                ...group,
                updatedAt: new Date(),
                name: 'new name'
            };

            prismaMock.group.update.mockResolvedValueOnce(group);

            const res = await updateGroup(
                '0e38cd5a-7f21-4b51-aaa4-bce33527144e',
                'new name',
                prismaMock
            );

            expect(res).toEqual({
                id: group.id,
                name: group.name
            });
            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(prismaMock.group.update).toBeCalledTimes(1);
        });

        it('Should not handle any errors thrown internally', async () => {
            prismaMock.group.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(
                updateGroup(
                    '0e38cd5a-7f21-4b51-aaa4-bce33527144e',
                    'name',
                    prismaMock
                )
            ).rejects.toThrow('test error');
        });
    });

    describe('deleteGroup', () => {
        it('Should return null if group not found', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce(null);

            const res = await deleteGroup(
                'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                prismaMock
            );

            expect(res).toBeNull();
            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.findMany).not.toBeCalled();
            expect(prismaMock.group.delete).not.toBeCalled();
        });

        it('Should return false if group has members', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce({
                id: 'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Group 1'
            });
            prismaMock.usersInGroups.findMany.mockResolvedValueOnce([
                {
                    userId: '590669ba-04ef-45e2-859e-422b0653c968',
                    groupId: '1b64c34f-8f57-4589-8e7d-b4554fc05f89',
                    assignedAt: new Date(),
                    assignedBy: '171c632a-526b-447c-8948-d8dc91e8160d'
                },
                {
                    userId: 'feb8bcb3-3d3d-453c-88dd-3a5a50d633eb',
                    groupId: 'f3a36524-6387-40f2-ada8-0265d97746dd',
                    assignedAt: new Date(),
                    assignedBy: '171c632a-526b-447c-8948-d8dc91e8160d'
                }
            ]);

            const res = await deleteGroup(
                'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                prismaMock
            );

            expect(res).toEqual(false);
            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.findMany).toBeCalledTimes(1);
            expect(prismaMock.group.delete).not.toBeCalled();
        });

        it('Should return true', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce({
                id: 'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Group 1'
            });
            prismaMock.usersInGroups.findMany.mockResolvedValueOnce([]);

            const res = await deleteGroup(
                'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                prismaMock
            );

            expect(res).toBeTruthy();
            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.findMany).toBeCalledTimes(1);
            expect(prismaMock.group.delete).toBeCalledTimes(1);
        });

        it('Should not handle any errors thrown internally', async () => {
            prismaMock.group.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(
                deleteGroup('b4e730e3-e037-4c41-881a-6af859e5d8ea', prismaMock)
            ).rejects.toThrow('test error');
        });
    });

    describe('addUsersToGroup', () => {
        it('Should return null if group not found', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce(null);

            const res = await addUsersToGroup(
                'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                ['a85c6091-b83d-49e0-becf-561621519360'],
                prismaMock
            );

            expect(res).toBeNull();
            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(prismaMock.user.findMany).not.toBeCalled();
            expect(prismaMock.usersInGroups.createMany).not.toBeCalled();
        });

        it('Should return false if any user not found', async () => {
            prismaMock.group.findFirst.mockResolvedValueOnce({
                id: 'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Group 1'
            });
            prismaMock.user.findMany.mockResolvedValueOnce([]);

            const res = await addUsersToGroup(
                'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                ['a85c6091-b83d-49e0-becf-561621519360'],
                prismaMock
            );

            expect(res).toEqual(false);
            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(prismaMock.user.findMany).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.createMany).not.toBeCalled();
        });

        it('Should return group with user ids', async () => {
            const group = {
                id: 'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Group 1'
            };

            const users = [
                {
                    id: 'a85c6091-b83d-49e0-becf-561621519360',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    expireAt: new Date(),
                    firstName: 'First',
                    lastName: 'User',
                    email: 'email@email.com',
                    emailVerified: false,
                    country: 'Finland',
                    company: 'Company Oy',
                    password: 'testPw',
                    appleId: null,
                    googleId: null,
                    microsoftId: null
                }
            ];

            prismaMock.group.findFirst.mockResolvedValueOnce(group);
            prismaMock.user.findMany.mockResolvedValueOnce(users);

            const res = await addUsersToGroup(
                'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                ['a85c6091-b83d-49e0-becf-561621519360'],
                prismaMock
            );

            expect(res).toEqual({
                id: group.id,
                name: group.name,
                users: [users[0].id]
            });
            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(prismaMock.user.findMany).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.createMany).toBeCalledTimes(1);
        });

        it('Should not handle any errors thrown internally', async () => {
            prismaMock.group.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(
                addUsersToGroup(
                    'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                    ['4a894bf0-e6c4-46bc-97ae-9cd6dbccc91f'],
                    prismaMock
                )
            ).rejects.toThrow('test error');
        });
    });

    describe('removeUserFromGroup', () => {
        it('Should return null if user not member of group', async () => {
            prismaMock.usersInGroups.findFirst.mockResolvedValueOnce(null);

            const res = await removeUserFromGroup(
                '12a23894-0fbf-4619-aa1a-dfe951a2a849',
                '8682a0a4-e924-48a6-8048-469bf2ad91ac',
                prismaMock
            );

            expect(res).toBeNull();
            expect(prismaMock.usersInGroups.findFirst).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.delete).not.toBeCalled();
        });

        it('Should return true', async () => {
            prismaMock.usersInGroups.findFirst.mockResolvedValueOnce({
                userId: '8682a0a4-e924-48a6-8048-469bf2ad91ac',
                groupId: '12a23894-0fbf-4619-aa1a-dfe951a2a849',
                assignedAt: new Date(),
                assignedBy: '31e0751f-1640-426a-aa90-005be1eeb1c9'
            });

            const res = await removeUserFromGroup(
                '12a23894-0fbf-4619-aa1a-dfe951a2a849',
                '8682a0a4-e924-48a6-8048-469bf2ad91ac',
                prismaMock
            );

            expect(res).toBeTruthy();
            expect(prismaMock.usersInGroups.findFirst).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.delete).toBeCalledTimes(1);
        });

        it('Should not handle any errors thrown internally', async () => {
            prismaMock.usersInGroups.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(
                removeUserFromGroup(
                    'b4e730e3-e037-4c41-881a-6af859e5d8ea',
                    '4a894bf0-e6c4-46bc-97ae-9cd6dbccc91f',
                    prismaMock
                )
            ).rejects.toThrow('test error');
        });
    });
});
