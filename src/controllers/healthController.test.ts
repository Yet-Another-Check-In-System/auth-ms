import { NextFunction, Request, Response } from 'express';

import { checkHealth } from '../services/healthService';
import * as responses from '../utils/responses';
import { get } from './healthController';

jest.mock('../utils/logger');
jest.mock('../services/healthService');
jest.mock('../utils/responses');

const mockedHealthService = jest.mocked(checkHealth);
const mockedResponses = jest.mocked(responses);

describe('healthController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('get', () => {
        it('Should call ok with result of `checkHealth`', async () => {
            mockedHealthService.mockResolvedValueOnce({
                server: true,
                database: false
            });

            await get(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                { server: true, database: false }
            );
        });
        it('Should call next with thrown error', async () => {
            mockedHealthService.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await get(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
        });
    });
});
