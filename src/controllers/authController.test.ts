import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ExportedUser, SignupLocalUser } from '../interfaces/IAuthService';
import * as responses from '../utils/responses';
import { logIn, signUpLocalUser } from './authController';
import * as authService from '../services/authService';

jest.mock('jsonwebtoken');
jest.mock('../utils/logger');
jest.mock('../utils/responses');
jest.mock('../services/authService');

const mockedResponses = jest.mocked(responses);
const mockedJwt = jest.mocked(jwt);
const mockedAuthService = jest.mocked(authService);

describe('authController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('logIn', () => {
        beforeEach(() => {
            mockRequest = {
                User: {
                    id: 'aa9ea8fc-c315-447c-a7e4-3a9b20830123',
                    firstName: 'Dummy',
                    lastName: 'User',
                    email: 'test@email.com',
                    country: 'FI',
                    company: 'Test company Oy'
                }
            };

            process.env.JWT_SECRET = 'secret';
        });

        it('Should call next with error when user not set', async () => {
            delete mockRequest.User;

            await logIn(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(
                new Error('User not set correctly')
            );
            expect(mockedResponses.ok).not.toBeCalled();
        });

        it('Should call next with error when JWT_SECRET not set', async () => {
            delete process.env.JWT_SECRET;

            await logIn(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(
                new Error('JWT_SECRET not set correctly')
            );
            expect(mockedResponses.ok).not.toBeCalled();
        });

        it('Should return ok when login successful', async () => {
            mockedJwt.sign.mockImplementationOnce(() => {
                return 'testToken';
            });

            await logIn(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.ok).toBeCalledTimes(1);
        });

        it('Should call next with error when error thrown', async () => {
            mockedJwt.sign.mockImplementationOnce(() => {
                return 'testToken';
            });

            mockedResponses.ok.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await logIn(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
            expect(mockedResponses.internalServerError).not.toBeCalled();
        });
    });

    describe('signUpLocalUser', () => {
        beforeEach(() => {
            const body: SignupLocalUser = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
                country: 'FI',
                company: 'TestCompany Oy',
                password: '12345678'
            };

            mockRequest = {
                body: body
            };
        });

        it('Should return bad request when user already exists', async () => {
            mockedAuthService.signupLocal.mockResolvedValueOnce(null);

            await signUpLocalUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.badRequest).toBeCalledTimes(1);
            expect(mockedResponses.created).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should return created when user exists', async () => {
            const exportedUser: ExportedUser = {
                id: 'fa16b447-0544-4e3f-a5dd-8d2241c3a352',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
                country: 'FI',
                company: 'TestCompany Oy'
            };

            mockedAuthService.signupLocal.mockResolvedValueOnce(exportedUser);

            await signUpLocalUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.created).toBeCalledTimes(1);
            expect(mockedResponses.badRequest).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should call next with error when error thrown', async () => {
            mockedAuthService.signupLocal.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await signUpLocalUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
            expect(mockedResponses.internalServerError).not.toBeCalled();
        });
    });
});
