import { Request, Response, NextFunction } from 'express';
import signupLocal from './signupLocal';
import * as responses from '../utils/responses';
import { signupLocal as signupLocalService } from '../services/userService';

jest.mock('../utils/logger');
jest.mock('../services/userService');
jest.mock('../utils/responses');

const mockedResponses = jest.mocked(responses);
const mockedSignupLocal = jest.mocked(signupLocalService);

describe('signupLocal', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();

        mockRequest = {
            body: {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
                password: 'testPw'
            },
            User: undefined
        };
    });

    it('Should return Bad Request when signup fails', async () => {
        mockedSignupLocal.mockResolvedValueOnce(null);

        await signupLocal()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).not.toBeCalled();
        expect(mockedResponses.badRequest).toBeCalledTimes(1);
        expect(mockedResponses.badRequest).toBeCalledWith(
            mockRequest,
            mockResponse,
            'The email is already associated with an account.'
        );
    });

    it('Should set user to request when successful', async () => {
        const user = {
            id: '944f2098-50f2-4e90-8ae5-50be2b2a8ab0',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@email.com',
            country: 'Finland',
            company: 'TestCompany Oy'
        };

        mockedSignupLocal.mockResolvedValueOnce(user);

        await signupLocal()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedResponses.badRequest).not.toBeCalled();
        expect(mockRequest.User).toEqual(user);
        expect(mockNext).toBeCalledTimes(1);
        expect(mockNext).toBeCalledWith();
    });

    it('Should handle errors being thrown', async () => {
        mockedSignupLocal.mockImplementationOnce(() => {
            throw new Error('test error');
        });

        await signupLocal()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedResponses.badRequest).not.toBeCalled();
        expect(mockNext).toBeCalledTimes(1);
        expect(mockNext).toBeCalledWith(new Error('test error'));
    });
});
