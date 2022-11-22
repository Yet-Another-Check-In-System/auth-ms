import { prismaMock } from '../utils/prismaMock';
import { createGroup, getGroup } from './groupService';

jest.mock('../utils/logger');

describe('groupService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('createGroup', () => {
        it('Should create a new group using Prisma', async () => {
            prismaMock.group.create.mockResolvedValueOnce({
                id: 'ee9b3e7d-9303-4371-bada-c4a5dbd91952',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'testName'
            });

            const res = await createGroup('testName', prismaMock);

            expect(prismaMock.group.create).toBeCalledTimes(1);
            expect(res).toEqual({
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

    describe('getGroup', () => {
        it('Should find the group using Prisma', async () => {
            const group = {
                id: 'f2a93269-f534-45fb-afb8-66a416728a01',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'testName'
            };

            prismaMock.group.findFirst.mockResolvedValueOnce(group);

            const res = await getGroup(
                'f2a93269-f534-45fb-afb8-66a416728a01',
                prismaMock
            );

            expect(prismaMock.group.findFirst).toBeCalledTimes(1);
            expect(res).toEqual(group);
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
});
