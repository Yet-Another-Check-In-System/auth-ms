import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize, authorizeSelf } from './authentication';
import * as responses from '../utils/responses';
import * as authService from '../services/authService';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../interfaces/IAuth';

jest.mock('jsonwebtoken');
jest.mock('../utils/logger');
jest.mock('../utils/responses');
jest.mock('../services/authService');

const mockedResponses = jest.mocked(responses);
const mockedJwt = jest.mocked(jwt);
const mockedAuthService = jest.mocked(authService);

describe('authentication', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('authenticate', () => {
        beforeEach(() => {
            process.env.JWT_SECRET = 'A';

            mockRequest = {
                headers: {
                    authorization: 'Bearer TESTTOKEN'
                }
            };
        });

        it('Should call next with error when JWT_SECRET not set', async () => {
            delete process.env.JWT_SECRET;

            await authenticate()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('JWT_SECRET not set'));
        });

        it('Should return unauthorized when header not set', async () => {
            delete mockRequest.headers?.authorization;

            await authenticate()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.unauthorized).toBeCalledTimes(1);
        });

        it('Should return unauthorized when method is not "Bearer"', async () => {
            mockRequest = {
                headers: {
                    authorization: 'Basic asd'
                }
            };

            await authenticate()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.unauthorized).toBeCalledTimes(1);
        });

        it('Should return unauthorized when token is not valid', async () => {
            mockedJwt.verify.mockImplementationOnce(() => {
                throw new Error('Token not valid');
            });

            await authenticate()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.unauthorized).toBeCalledTimes(1);
        });

        it('Should set token payload to request when successful', async () => {
            const payload: TokenPayload = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@email.com',
                country: 'FI',
                company: null,
                exp: 1000001,
                iat: 1000000,
                aud: ['audience:1'],
                iss: 'issuer',
                sub: 'e5d6b420-511f-4d3e-9af2-ee645bb1c35b'
            };

            mockedJwt.verify.mockReturnValueOnce(payload as unknown as void);

            await authenticate()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockedResponses.unauthorized).not.toBeCalled();
        });
    });

    describe('authorize', () => {
        beforeEach(() => {
            process.env.JWT_SECRET = 'A';

            mockRequest = {
                TokenPayload: {
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane@email.com',
                    country: 'FI',
                    company: null,
                    exp: 1000001,
                    iat: 1000000,
                    aud: ['audience:1'],
                    iss: 'issuer',
                    sub: 'e5d6b420-511f-4d3e-9af2-ee645bb1c35b'
                }
            };
        });

        it('Should call next with error when TokenPayload not set', async () => {
            delete mockRequest.TokenPayload;

            await authorize('*.test.permission')(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(
                new Error(
                    'Request.User not set correctly! Was authenticate called before this function?'
                )
            );
        });

        it('Should return forbidden when user is not authorized', async () => {
            mockedAuthService.authorize.mockResolvedValueOnce([false, []]);

            await authorize('*.test.permission')(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.forbidden).toBeCalledTimes(1);
        });

        it('Should call next when successful', async () => {
            mockedAuthService.authorize.mockResolvedValueOnce([
                true,
                ['basic.test.permission']
            ]);

            await authorize('*.test.permission')(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockedResponses.forbidden).not.toBeCalled();
        });
    });

    describe('authorizeSelf', () => {
        beforeEach(() => {
            process.env.JWT_SECRET = 'A';

            mockRequest = {
                params: {
                    userId: '45879066-fa0f-4bbb-8921-e0cc7488e311'
                },
                TokenPayload: {
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane@email.com',
                    country: 'FI',
                    company: null,
                    exp: 1000001,
                    iat: 1000000,
                    aud: ['audience:1'],
                    iss: 'issuer',
                    sub: 'e5d6b420-511f-4d3e-9af2-ee645bb1c35b'
                }
            };
        });

        it('Should call next with error when TokenPayload not set', async () => {
            delete mockRequest.TokenPayload;

            await authorizeSelf('*.test.permission')(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(
                new Error(
                    'Request.User not set correctly! Was authenticate called before this function?'
                )
            );
        });

        it('Should return bad request when requestedId is not set', async () => {
            delete mockRequest.params?.userId;

            await authorizeSelf('*.test.permission')(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.badRequest).toBeCalledTimes(1);
        });

        it('Should return forbidden when user is not authorized', async () => {
            mockedAuthService.authorize.mockResolvedValueOnce([false, []]);

            await authorizeSelf('*.test.permission')(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.forbidden).toBeCalledTimes(1);
        });

        it('Should return forbidden when user is not admin and authorizing for another user', async () => {
            mockedAuthService.authorize.mockResolvedValueOnce([
                true,
                ['basic.test.permission']
            ]);

            await authorizeSelf('*.test.permission')(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.forbidden).toBeCalledTimes(1);
        });

        it('Should call next when authorizing for self and successful', async () => {
            mockRequest.params = {
                userId: 'e5d6b420-511f-4d3e-9af2-ee645bb1c35b'
            };

            mockedAuthService.authorize.mockResolvedValueOnce([
                true,
                ['basic.test.permission']
            ]);

            await authorizeSelf('*.test.permission')(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockedResponses.forbidden).not.toBeCalled();
        });

        it('Should call next when authorizing for other, caller is admin and successful', async () => {
            mockedAuthService.authorize.mockResolvedValueOnce([
                true,
                ['admin.test.permission']
            ]);

            await authorizeSelf('*.test.permission')(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockedResponses.forbidden).not.toBeCalled();
        });
    });
});
