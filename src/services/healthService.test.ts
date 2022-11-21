import { checkHealth } from './healthService';
import { prismaMock } from '../utils/prismaMock';
import { PrismaClientInitializationError } from '@prisma/client/runtime';

jest.mock('../utils/logger');

describe('healthService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('checkHealth', () => {
        it('Should return true for both when database query succeed', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(null);

            const res = await checkHealth(prismaMock);

            expect(res).not.toBeNull();
            expect(res).toEqual({
                server: true,
                database: true
            });
        });

        it('Should handle errors being thrown', async () => {
            prismaMock.user.findFirst.mockImplementationOnce(() => {
                throw new PrismaClientInitializationError(
                    'test error',
                    '6.4.1'
                );
            });

            const res = await checkHealth(prismaMock);

            expect(res).not.toBeNull();
            expect(res).toEqual({
                server: true,
                database: false
            });
        });
    });
});
