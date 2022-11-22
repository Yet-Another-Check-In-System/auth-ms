import { NextFunction, Request, Response } from 'express';
import * as groupService from '../services/groupService';
import * as responses from '../utils/responses';
import { createNewGroup, getGroups, getGroup } from './groupController';

jest.mock('../services/groupService');
jest.mock('../utils/logger');
jest.mock('../utils/responses');

const mockedGroupService = jest.mocked(groupService);
const mockedResponses = jest.mocked(responses);

describe('groupController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('createNewGroup', () => {
        beforeEach(() => {
            mockRequest = {
                body: {
                    name: 'testName'
                }
            };
        });

        it('Should call created with received data', async () => {
            mockedGroupService.createGroup.mockResolvedValueOnce({
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
            mockedGroupService.createGroup.mockImplementationOnce(() => {
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

    describe('getGroups', () => {
        it('Should call ok with received data', async () => {
            const groups = [
                {
                    id: '302712a3-9481-4b11-8477-d7832cc7d525',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'testName 1'
                },
                {
                    id: '064f626c-4ba1-4139-b0da-e4d4e5d38df1',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'testName 2'
                }
            ];

            mockedGroupService.getGroups.mockResolvedValueOnce(groups);

            await getGroups(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                {
                    groups: groups
                }
            );
            expect(mockNext).not.toBeCalled();
        });

        it('Should handle no results', async () => {
            mockedGroupService.getGroups.mockResolvedValueOnce([]);

            await getGroups(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                {
                    groups: []
                }
            );
            expect(mockNext).not.toBeCalled();
        });

        it('Should handle errors being thrown', async () => {
            mockedGroupService.getGroups.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await getGroups(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
        });
    });

    describe('getGroup', () => {
        beforeEach(() => {
            mockRequest = {
                query: {
                    groupId: '34c48a24-311e-412b-9716-e71f177ee6c4'
                }
            };
        });

        it('Should call ok with received data', async () => {
            const group = {
                id: '302712a3-9481-4b11-8477-d7832cc7d525',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'testName'
            };

            mockedGroupService.getGroup.mockResolvedValueOnce(group);

            await getGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                group
            );
            expect(mockNext).not.toBeCalled();
        });

        it('Should call not found if no reports are found', async () => {
            mockedGroupService.getGroup.mockResolvedValueOnce(null);

            await getGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.notFound).toBeCalledTimes(1);
            expect(mockedResponses.notFound).toBeCalledWith(
                mockRequest,
                mockResponse
            );
            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should handle errors being thrown', async () => {
            mockedGroupService.getGroup.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await getGroup(
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
