import * as IUser from '../interfaces/IUser';
import * as userService from './userService';
import { prismaMock } from '../utils/prismaMock';
import { User } from '@prisma/client';

describe('userService', () => {
    describe('getAllUsers', () => {
        it('Should return all users found', async () => {
            const users = [
                {
                    id: '0568ec82-8e4e-4356-937a-35c77650df65',
                    firstName: 'Test',
                    lastName: 'Account',
                    email: 'test@email.com',
                    country: 'FI',
                    company: 'Test company Oy'
                },
                {
                    id: 'a86e7cd9-fedb-4e8d-8f3e-107840bb77d9',
                    firstName: 'Dummy',
                    lastName: 'User',
                    email: 'dummy@email.com',
                    country: 'FI',
                    company: 'Test company Oy'
                }
            ];

            prismaMock.user.findMany.mockResolvedValueOnce(users as User[]);

            const res = await userService.getAllUsers(prismaMock);

            expect(res).toEqual(users);
            expect(prismaMock.user.findMany).toBeCalledTimes(1);
        });

        it('Should not handle exceptions thrown', async () => {
            prismaMock.user.findMany.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(() =>
                userService.getAllUsers(prismaMock)
            ).rejects.toThrowError('test error');
        });
    });

    describe('getSingleUser', () => {
        it('Should return user when found', async () => {
            const user = {
                id: '0568ec82-8e4e-4356-937a-35c77650df65',
                firstName: 'Test',
                lastName: 'Account',
                email: 'test@email.com',
                country: 'FI',
                company: 'Test company Oy'
            };

            prismaMock.user.findFirst.mockResolvedValueOnce(user as User);

            const res = await userService.getSingleUser(user.id, prismaMock);

            expect(res).toEqual(user);
            expect(prismaMock.user.findFirst).toBeCalledTimes(1);
        });

        it('Should return null when user not found', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(null);

            const res = await userService.getSingleUser(
                '9163404c-6504-49c0-b99b-5b0c6f1975be',
                prismaMock
            );

            expect(res).toEqual(null);
            expect(prismaMock.user.findFirst).toBeCalledTimes(1);
        });

        it('Should not handle exceptions thrown', async () => {
            prismaMock.user.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(() =>
                userService.getSingleUser(
                    '18e6ca67-984a-4040-9a99-370b4d696e95',
                    prismaMock
                )
            ).rejects.toThrowError('test error');
        });
    });

    describe('updateSingleUser', () => {
        it('Should return updated user', async () => {
            const oldUser = {
                id: '0568ec82-8e4e-4356-937a-35c77650df65',
                firstName: 'Test',
                lastName: 'Account',
                email: 'test@email.com',
                country: 'FI',
                company: 'Test company Oy'
            };

            const patchValues: IUser.PatchSingleUser = {
                email: 'dummy@email.com',
                country: 'SV'
            };

            const newUser = {
                ...oldUser,
                email: patchValues.email,
                country: patchValues.country
            };

            prismaMock.user.findFirst.mockResolvedValueOnce(oldUser as User);
            prismaMock.user.update.mockResolvedValueOnce(newUser as User);

            const res = await userService.updateSingleUser(
                oldUser.id,
                patchValues,
                prismaMock
            );

            expect(res).toEqual(newUser);
            expect(prismaMock.user.findFirst).toBeCalledTimes(1);
            expect(prismaMock.user.update).toBeCalledTimes(1);
        });

        it('Should return null when user not found', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(null);

            const patchValues: IUser.PatchSingleUser = {
                email: 'dummy@email.com',
                country: 'SV'
            };

            const res = await userService.updateSingleUser(
                'f8081dbd-4218-463b-a775-c67539de0037',
                patchValues,
                prismaMock
            );

            expect(res).toBeNull();
            expect(prismaMock.user.findFirst).toBeCalledTimes(1);
            expect(prismaMock.user.update).not.toBeCalled();
        });

        it('Should not handle exceptions thrown', async () => {
            prismaMock.user.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(() =>
                userService.updateSingleUser(
                    '18e6ca67-984a-4040-9a99-370b4d696e95',
                    {},
                    prismaMock
                )
            ).rejects.toThrowError('test error');
        });
    });

    describe('deleteSingleUser', () => {
        it('Should return true when successful', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce({
                id: '3d91b54c-18e6-4df5-88eb-7bda9a383399'
            } as User);

            prismaMock.usersInGroups.findMany.mockResolvedValueOnce([]);

            const res = await userService.deleteSingleUser(
                '3d91b54c-18e6-4df5-88eb-7bda9a383399',
                prismaMock
            );

            expect(res).toEqual(true);
            expect(prismaMock.user.findFirst).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.findMany).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.deleteMany).not.toBeCalled();
            expect(prismaMock.user.delete).toBeCalledTimes(1);
        });

        it('Should remove user from all groups', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce({
                id: '3d91b54c-18e6-4df5-88eb-7bda9a383399'
            } as User);

            prismaMock.usersInGroups.findMany.mockResolvedValueOnce([
                {
                    userId: '3d91b54c-18e6-4df5-88eb-7bda9a383399',
                    groupId: '63ba43fa-a000-4c17-8e0a-9c2b7ff8f68a',
                    assignedAt: new Date(),
                    assignedBy: null
                },
                {
                    userId: '3d91b54c-18e6-4df5-88eb-7bda9a383399',
                    groupId: 'e56b11c4-4e6b-4888-b2ab-591af28b3751',
                    assignedAt: new Date(),
                    assignedBy: null
                }
            ]);

            const res = await userService.deleteSingleUser(
                '3d91b54c-18e6-4df5-88eb-7bda9a383399',
                prismaMock
            );

            expect(res).toEqual(true);
            expect(prismaMock.user.findFirst).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.findMany).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.deleteMany).toBeCalledTimes(1);
            expect(prismaMock.user.delete).toBeCalledTimes(1);
        });

        it('Should return null when user not found', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(null);

            const res = await userService.deleteSingleUser(
                '3d91b54c-18e6-4df5-88eb-7bda9a383399',
                prismaMock
            );

            expect(res).toEqual(null);
            expect(prismaMock.user.findFirst).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.findMany).not.toBeCalled();
            expect(prismaMock.usersInGroups.deleteMany).not.toBeCalled();
            expect(prismaMock.user.delete).not.toBeCalled();
        });

        it('Should not handle exceptions thrown', async () => {
            prismaMock.user.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await expect(() =>
                userService.deleteSingleUser(
                    '18e6ca67-984a-4040-9a99-370b4d696e95',
                    prismaMock
                )
            ).rejects.toThrowError('test error');
        });
    });
});
