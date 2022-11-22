import { prismaMock } from '../utils/prismaMock';
import { createGroup } from './groupService';

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
    });
});
