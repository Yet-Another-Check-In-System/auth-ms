import { NextFunction, Request, Response } from 'express';

import * as userService from '../services/userService';
import * as responses from '../utils/responses';
import * as userController from './userController';

jest.mock('../services/userService');
jest.mock('../utils/logger');
jest.mock('../utils/responses');

const mockedUserService = jest.mocked(userService);
const mockedResponses = jest.mocked(responses);

describe('userController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getAllUsers', () => {
        it('Should return ok with users', async () => {
            const users = [
                {
                    id: '9d2ee86e-75d8-45e9-ac72-83f846e66e9e',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@email.com',
                    country: 'FI',
                    company: 'Company Oy'
                },
                {
                    id: '2c20c254-1de8-4669-a859-d6c1f3382534',
                    firstName: 'Dummy',
                    lastName: 'Account',
                    email: 'dummy@email.com',
                    country: 'SV',
                    company: 'Company Ab'
                }
            ];

            mockedUserService.getAllUsers.mockResolvedValueOnce(users);

            await userController.getAllUsers(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                { users: users }
            );
            expect(mockNext).not.toBeCalled();
        });

        it('Should return ok with empty array when users not found', async () => {
            mockedUserService.getAllUsers.mockResolvedValueOnce([]);

            await userController.getAllUsers(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                { users: [] }
            );
            expect(mockNext).not.toBeCalled();
        });

        it('Should call next when error is thrown', async () => {
            mockedUserService.getAllUsers.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await userController.getAllUsers(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
            expect(mockedResponses.ok).not.toBeCalled();
        });
    });

    describe('getSingleUser', () => {
        beforeEach(() => {
            mockRequest = {
                query: {
                    userId: '9d2ee86e-75d8-45e9-ac72-83f846e66e9e'
                }
            };
        });

        it('Should return ok with user', async () => {
            const user = {
                id: '9d2ee86e-75d8-45e9-ac72-83f846e66e9e',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
                country: 'FI',
                company: 'Company Oy'
            };

            mockedUserService.getSingleUser.mockResolvedValueOnce(user);

            await userController.getSingleUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                { user: user }
            );
            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.notFound).not.toBeCalled();
        });

        it('Should return not found when user is not found', async () => {
            mockedUserService.getSingleUser.mockResolvedValueOnce(null);

            await userController.getSingleUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.notFound).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.ok).not.toBeCalled();
        });

        it('Should call next when error is thrown', async () => {
            mockedUserService.getSingleUser.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await userController.getSingleUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockedResponses.notFound).not.toBeCalled();
        });
    });

    describe('updateSingleUser', () => {
        beforeEach(() => {
            mockRequest = {
                query: {
                    userId: '9d2ee86e-75d8-45e9-ac72-83f846e66e9e'
                },
                body: {
                    email: 'newMail@email.com',
                    firstName: 'Dummy',
                    lastName: 'Account',
                    country: 'FI',
                    company: 'New company Oy'
                }
            };
        });

        it('Should return ok with updated user', async () => {
            const updatedUser = {
                id: '9d2ee86e-75d8-45e9-ac72-83f846e66e9e',
                createdAt: new Date(),
                updatedAt: new Date(),
                expireAt: new Date(),
                email: 'newMail@email.com',
                emailVerified: false,
                firstName: 'Dummy',
                lastName: 'Account',
                country: 'FI',
                company: 'New company Oy',
                password: null,
                appleId: '24013b11-7d7d-4cfc-8641-bb1eb0ce3252',
                googleId: null,
                microsoftId: null
            };

            mockedUserService.updateSingleUser.mockResolvedValueOnce(
                updatedUser
            );

            await userController.updateSingleUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                { user: updatedUser }
            );
            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.notFound).not.toBeCalled();
        });

        it('Should return not found when user is not found', async () => {
            mockedUserService.updateSingleUser.mockResolvedValueOnce(null);

            await userController.updateSingleUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.notFound).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.ok).not.toBeCalled();
        });

        it('Should call next when error is thrown', async () => {
            mockedUserService.updateSingleUser.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await userController.updateSingleUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockedResponses.notFound).not.toBeCalled();
        });
    });

    describe('deleteSingleUser', () => {
        beforeEach(() => {
            mockRequest = {
                query: {
                    userId: '9d2ee86e-75d8-45e9-ac72-83f846e66e9e'
                }
            };
        });

        it('Should return no content when successful', async () => {
            mockedUserService.deleteSingleUser.mockResolvedValueOnce(true);

            await userController.deleteSingleUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.noContent).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.notFound).not.toBeCalled();
        });

        it('Should return not found when user is not found', async () => {
            mockedUserService.deleteSingleUser.mockResolvedValueOnce(null);

            await userController.deleteSingleUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.notFound).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.noContent).not.toBeCalled();
        });

        it('Should call next when error is thrown', async () => {
            mockedUserService.deleteSingleUser.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await userController.deleteSingleUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
            expect(mockedResponses.noContent).not.toBeCalled();
            expect(mockedResponses.notFound).not.toBeCalled();
        });
    });
});
