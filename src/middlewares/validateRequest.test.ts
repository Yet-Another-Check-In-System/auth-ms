import { Request, Response, NextFunction } from 'express';
import validateRequest from './validateRequest';
import { Result, validationResult } from 'express-validator';
import * as responses from '../utils/responses';

jest.mock('express-validator');
jest.mock('../utils/logger');
jest.mock('../utils/responses');

const mockedResponses = jest.mocked(responses);
const mockedValidationResult = jest.mocked(validationResult);

describe('validateRequest', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('Should return Bad Request if there are validation errors', async () => {
        const result: Partial<Result> = {
            isEmpty: jest.fn().mockReturnValue(false)
        };
        mockedValidationResult.mockReturnValueOnce(result as Result);

        await validateRequest()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).not.toBeCalled();
        expect(mockedResponses.badRequest).toBeCalledTimes(1);
        expect(mockedResponses.badRequest).toBeCalledWith(
            mockRequest,
            mockResponse
        );
    });

    it('Should call next if there are no validation errors', async () => {
        const result: Partial<Result> = {
            isEmpty: jest.fn().mockReturnValue(true)
        };
        mockedValidationResult.mockReturnValueOnce(result as Result);

        await validateRequest()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedResponses.badRequest).not.toBeCalled();
        expect(mockNext).toBeCalledTimes(1);
        expect(mockNext).toBeCalledWith();
    });

    it('Should handle errors being thrown', async () => {
        const result: Partial<Result> = {
            isEmpty: jest.fn().mockImplementation(() => {
                throw new Error('test error');
            })
        };
        mockedValidationResult.mockReturnValueOnce(result as Result);

        await validateRequest()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedResponses.badRequest).not.toBeCalled();
        expect(mockNext).toBeCalledTimes(1);
        expect(mockNext).toBeCalledWith(new Error('test error'));
    });
});
