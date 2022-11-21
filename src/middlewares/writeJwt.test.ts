import { Request, Response, NextFunction } from 'express';
import writeJwt from './writeJwt';
import jwt from 'jsonwebtoken';

jest.mock('../utils/logger');
jest.mock('jsonwebtoken');

const mockedJwt = jest.mocked(jwt);

describe('writeJwt', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();

        process.env.JWT_SECRET = 'secret';

        mockRequest = {
            User: {
                id: 'dc6f2321-7096-4dd5-bf63-e6647dcc3426',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com'
            }
        };

        mockResponse = {
            Token: undefined
        };
    });

    it('Should call next with error if user not set', async () => {
        mockRequest.User = undefined;

        await writeJwt()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toBeCalledTimes(1);
        expect(mockNext).toBeCalledWith(new Error('User not set correctly'));
    });

    it('Should call next with error if JWT_SECRET not set', async () => {
        delete process.env.JWT_SECRET;

        await writeJwt()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toBeCalledTimes(1);
        expect(mockNext).toBeCalledWith(
            new Error('Could not login due to JWT_SECRET not being set')
        );
    });

    it('Should call next if successful', async () => {
        mockedJwt.sign.mockImplementationOnce(() => {
            return 'testToken';
        });

        await writeJwt()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockResponse.Token).toEqual('testToken');
        expect(mockNext).toBeCalledTimes(1);
        expect(mockNext).toBeCalledWith();
    });
});
