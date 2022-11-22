import { runClean } from './cleanUserData';
import { prismaMock } from './prismaMock';
import { User } from '@prisma/client';

jest.mock('./logger');

describe('cleanUserData', () => {
    describe('runClean', () => {
        it('Should do nothing if there are no expired users', async () => {
            const users: User[] = [];
            prismaMock.user.findMany.mockResolvedValueOnce(users);

            await runClean(prismaMock);

            expect(prismaMock.cleanUp.create).toBeCalledTimes(1);
            expect(prismaMock.usersInGroups.deleteMany).not.toBeCalled();
            expect(prismaMock.user.deleteMany).not.toBeCalled();
        });

        it('Should clean if there are expired users', async () => {
            const users: User[] = [
                {
                    id: '7c76892f-4abf-4776-8067-caf19ad1f901',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    expireAt: new Date(),
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@email.com',
                    emailVerified: false,
                    country: 'Finland',
                    company: 'Test company Oy',
                    password: 'testpassword',
                    appleId: null,
                    googleId: null,
                    microsoftId: null
                },
                {
                    id: 'ed6def4e-f02c-4cfd-874f-adfcad220bf2',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    expireAt: new Date(),
                    firstName: 'Dummy',
                    lastName: 'Tester',
                    email: 'dummy@email.com',
                    emailVerified: false,
                    country: 'Finland',
                    company: 'Test company Oy',
                    password: 'testpassword222',
                    appleId: null,
                    googleId: null,
                    microsoftId: null
                }
            ];

            prismaMock.user.findMany.mockResolvedValueOnce(users);

            await runClean(prismaMock);

            expect(prismaMock.usersInGroups.deleteMany).toBeCalledTimes(1);
            expect(prismaMock.user.deleteMany).toBeCalledTimes(1);
            expect(prismaMock.cleanUp.create).toBeCalledTimes(1);
        });
    });
});
