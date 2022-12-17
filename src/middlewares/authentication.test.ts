import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize, authorizeSelf } from './authentication';
import * as responses from '../utils/responses';
import * as authService from '../services/authService';
import jwt from 'jsonwebtoken';

jest.mock('../utils/logger');
jest.mock('../utils/responses');

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

        it.todo('Should call next with error when JWT_SECRET not set');

        it.todo('Should return unauthorized when header not set');

        it.todo('Should return unauthorized when method is not "Bearer"');

        it.todo('Should return unauthorized when token is not valid');

        it.todo('Should set token payload to request when successful');
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

        it.todo('Should call next with error when TokenPayload not set');

        it.todo('Should return forbidden when user is not authorized');

        it.todo('Should call next when successful');
    });

    describe('authorizeSelf', () => {
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

        it.todo('Should call next with error when TokenPayload not set');

        it.todo('Should return bad request when requestedId is not set');

        it.todo('Should return forbidden when user is not authorized');

        it.todo(
            'Should return forbidden when user is not admin and authorizing for another user'
        );

        it.todo('Should call next when successful');
    });
});
