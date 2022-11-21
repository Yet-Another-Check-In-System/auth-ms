import { Request, Response, NextFunction } from 'express';
import localLogin from './localLogin';
import * as responses from '../utils/responses';
import { verifyLocalLogin } from '../services/userService';

jest.mock('../utils/logger');
jest.mock('../services/userService');
jest.mock('../utils/responses');

const mockedResponses = jest.mocked(responses);
const mockedVerifyLocalLogin = jest.mocked(verifyLocalLogin);

describe('localLogin', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();

        mockRequest = {
            body: {
                email: 'test@email.com',
                password: 'testPw'
            },
            User: undefined
        };
    });

    it('Should return unauthorized if user is not verified', async () => {
        mockedVerifyLocalLogin.mockResolvedValueOnce(null);

        await localLogin()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedResponses.unauthorized).toBeCalledTimes(1);
        expect(mockedResponses.unauthorized).toBeCalledWith(
            mockRequest,
            mockResponse,
            'Incorrect email or password.'
        );
    });

    it('Should call next if successful', async () => {
        const user = {
            id: '7d74863b-1077-449e-b8cd-29a48911adf1',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@email.com'
        };

        mockedVerifyLocalLogin.mockResolvedValueOnce(user);

        await localLogin()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedResponses.unauthorized).not.toBeCalled();
        expect(mockRequest.User).toEqual(user);
        expect(mockNext).toBeCalledTimes(1);
        expect(mockNext).toBeCalledWith();
    });

    it('Should handle errors being thrown', async () => {
        mockedVerifyLocalLogin.mockImplementationOnce(async () => {
            throw new Error('test error');
        });

        await localLogin()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedResponses.unauthorized).not.toBeCalled();
        expect(mockNext).toBeCalledTimes(1);
        expect(mockNext).toBeCalledWith(new Error('test error'));
    });
});
