import { NextFunction, Request, Response } from 'express';
import { createGroup } from '../services/groupService';
import * as responses from '../utils/responses';
import { createNewGroup } from './groupController';

jest.mock('../services/groupService');
jest.mock('../utils/logger');
jest.mock('../utils/responses');

const mockedCreateGroup = jest.mocked(createGroup);
const mockedResponses = jest.mocked(responses);

describe('groupController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();

        mockRequest = {
            body: {
                name: 'testName'
            }
        };
    });

    describe('createNewGroup', () => {
        it('Should call created with received data', async () => {
            mockedCreateGroup.mockResolvedValueOnce({
                name: 'testName',
                users: []
            });

            await createNewGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.created).toBeCalledTimes(1);
            expect(mockedResponses.created).toBeCalledWith(
                mockRequest,
                mockResponse,
                { name: 'testName', users: [] }
            );
            expect(mockNext).not.toBeCalled();
        });

        it('Should handle errors being thrown', async () => {
            mockedCreateGroup.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await createNewGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.created).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
        });
    });
});
