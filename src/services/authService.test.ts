import bcrypt from 'bcryptjs';

import { prismaMock } from '../utils/prismaMock';
import { signupLocal, verifyLocalLogin } from './authService';

jest.mock('../utils/logger');

describe('authService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('verifyLocalLogin', () => {
        it('Should return null if user not found', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(null);

            const res = await verifyLocalLogin(
                'test@email.com',
                'testPw',
                prismaMock
            );

            expect(res).toBeNull();
        });

        it('Should return null if user does not have password', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce({
                id: 'aea9f718-0058-4edf-a764-40c4a837b38b',
                createdAt: new Date(),
                updatedAt: new Date(),
                expireAt: new Date(),
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
                emailVerified: false,
                country: 'Finland',
                company: 'TestCompany Oy',
                password: null,
                appleId: null,
                googleId: '95a6f9e8-1829-49a0-b938-0b3db98f2044',
                microsoftId: null
            });

            const res = await verifyLocalLogin(
                'test@email.com',
                'testPw',
                prismaMock
            );

            expect(res).toBeNull();
        });

        it('Should return null if password does not match hash', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce({
                id: 'aea9f718-0058-4edf-a764-40c4a837b38b',
                createdAt: new Date(),
                updatedAt: new Date(),
                expireAt: new Date(),
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
                emailVerified: false,
                country: 'Finland',
                company: 'TestCompany Oy',
                password: bcrypt.hashSync('testPw', 10),
                appleId: null,
                googleId: '95a6f9e8-1829-49a0-b938-0b3db98f2044',
                microsoftId: null
            });

            const res = await verifyLocalLogin(
                'test@email.com',
                'testPw1',
                prismaMock
            );

            expect(res).toBeNull();
        });

        it('Should return user data', async () => {
            const user = {
                id: 'aea9f718-0058-4edf-a764-40c4a837b38b',
                createdAt: new Date(),
                updatedAt: new Date(),
                expireAt: new Date(),
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
                emailVerified: false,
                country: 'Finland',
                company: 'TestCompany Oy',
                password: bcrypt.hashSync('testPw', 10),
                appleId: null,
                googleId: '95a6f9e8-1829-49a0-b938-0b3db98f2044',
                microsoftId: null
            };

            prismaMock.user.findFirst.mockResolvedValueOnce(user);

            const res = await verifyLocalLogin(
                'test@email.com',
                'testPw',
                prismaMock
            );

            expect(res).not.toBeNull();
            expect(res).toEqual({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                country: user.country,
                company: user.company
            });
        });
    });

    describe('signupLocal', () => {
        it('Should return null if user exists', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce({
                id: 'aea9f718-0058-4edf-a764-40c4a837b38b',
                createdAt: new Date(),
                updatedAt: new Date(),
                expireAt: new Date(),
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
                emailVerified: false,
                country: 'Finland',
                company: 'TestCompany Oy',
                password: bcrypt.hashSync('testPw', 10),
                appleId: null,
                googleId: '95a6f9e8-1829-49a0-b938-0b3db98f2044',
                microsoftId: null
            });

            const res = await signupLocal(
                {
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@email.com',
                    password: 'testPw',
                    country: 'Finland',
                    company: 'TestCompany Oy'
                },
                prismaMock
            );

            expect(res).toBeNull();
        });

        it('Should create user and return data', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(null);
            prismaMock.user.create.mockResolvedValueOnce({
                id: '91179c21-0c48-4abc-aa0c-42b284aaa55b',
                createdAt: new Date(),
                updatedAt: new Date(),
                expireAt: new Date(),
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
                emailVerified: false,
                country: 'Finland',
                company: 'TestCompany Oy',
                password: bcrypt.hashSync('testPw', 10),
                appleId: null,
                googleId: null,
                microsoftId: null
            });

            const res = await signupLocal(
                {
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@email.com',
                    password: 'testPw',
                    country: 'Finland',
                    company: 'TestCompany Oy'
                },
                prismaMock
            );

            expect(res).not.toBeNull();
            expect(res).toEqual({
                id: '91179c21-0c48-4abc-aa0c-42b284aaa55b',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
                country: 'Finland',
                company: 'TestCompany Oy'
            });
        });
    });
});
