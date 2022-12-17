import bcrypt from 'bcryptjs';

import { prismaMock } from '../utils/prismaMock';
import { signupLocal, verifyLocalLogin, authorize } from './authService';
import * as permissionService from './permissionService';

jest.mock('../utils/logger');
jest.mock('./permissionService');

const mockedPermissionService = jest.mocked(permissionService);

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

    describe('authorize', () => {
        it('Should return false and [] when fetching permissions fails', async () => {
            mockedPermissionService.getUserPermission.mockResolvedValueOnce(
                null
            );

            const [allowed, matchedPermissions] = await authorize(
                'a304c861-959f-47b8-9b78-e313d0cc5b98',
                '*.test.permission',
                prismaMock
            );

            expect(allowed).toEqual(false);
            expect(matchedPermissions).toEqual([]);
        });

        it('Should return false and [] when no matching permissions found', async () => {
            mockedPermissionService.getUserPermission.mockResolvedValueOnce([
                'basic.test.permission2'
            ]);

            const [allowed, matchedPermissions] = await authorize(
                'a304c861-959f-47b8-9b78-e313d0cc5b98',
                '*.test.permission',
                prismaMock
            );

            expect(allowed).toEqual(false);
            expect(matchedPermissions).toEqual([]);
        });

        it('Should return true and matched permission when successful', async () => {
            mockedPermissionService.getUserPermission.mockResolvedValueOnce([
                'basic.test.permission'
            ]);

            const [allowed, matchedPermissions] = await authorize(
                'a304c861-959f-47b8-9b78-e313d0cc5b98',
                '*.test.permission',
                prismaMock
            );

            expect(allowed).toEqual(true);
            expect(matchedPermissions).toEqual(['basic.test.permission']);
        });
    });
});
