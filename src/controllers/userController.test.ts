import { NextFunction, Request, Response } from 'express';

import * as responses from '../utils/responses';
import { logInLocalUser, signUpLocalUser } from './userController';
import { ExportedUser } from '../interfaces/IUserService';

jest.mock('../utils/logger');
jest.mock('../utils/responses');

const mockedResponses = jest.mocked(responses);

describe('userController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('logInLocalUser', () => {
        beforeEach(() => {
            mockResponse = {
                Token: undefined
            };
        });

        it('Should return internal server error when token not set', async () => {
            await logInLocalUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.ok).not.toBeCalled();
            expect(responses.internalServerError).toBeCalledTimes(1);
            expect(responses.internalServerError).toBeCalledWith(
                mockRequest,
                mockResponse
            );
        });

        it('Should return ok when token exists', async () => {
            mockResponse = {
                Token: 'testToken'
            };

            await logInLocalUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.internalServerError).not.toBeCalled();
            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                { token: 'testToken' }
            );
        });

        it('Should call next with error when error thrown', async () => {
            mockResponse = {
                Token: 'testToken'
            };

            mockedResponses.ok.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await logInLocalUser(
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
            mockRequest = {
                User: undefined
            };
        });

        it('Should return internal server error when user not set', async () => {
            await signUpLocalUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.ok).not.toBeCalled();
            expect(responses.internalServerError).toBeCalledTimes(1);
            expect(responses.internalServerError).toBeCalledWith(
                mockRequest,
                mockResponse
            );
        });

        it('Should return created when user exists', async () => {
            const user: ExportedUser = {
                id: 'fa16b447-0544-4e3f-a5dd-8d2241c3a352',
                firstName: 'Test',
                lastName: 'User',
                fullname: 'Test User',
                email: 'test@email.com'
            };

            mockRequest = {
                User: user
            };

            await signUpLocalUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.internalServerError).not.toBeCalled();
            expect(mockedResponses.created).toBeCalledTimes(1);
            expect(mockedResponses.created).toBeCalledWith(
                mockRequest,
                mockResponse,
                { email: user.email }
            );
        });
        it('Should call next with error when error thrown', async () => {
            const user: ExportedUser = {
                id: 'fa16b447-0544-4e3f-a5dd-8d2241c3a352',
                firstName: 'Test',
                lastName: 'User',
                fullname: 'Test User',
                email: 'test@email.com'
            };

            mockRequest = {
                User: user
            };

            mockedResponses.created.mockImplementationOnce(() => {
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
