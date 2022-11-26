import { NextFunction, Request, Response } from 'express';

import * as groupService from '../services/groupService';
import * as responses from '../utils/responses';
import {
    addUsersToGroup,
    createGroup,
    deleteGroup,
    getGroup,
    getGroups,
    removeUserFromGroup,
    updateGroup
} from './groupController';

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

    describe('createGroup', () => {
        beforeEach(() => {
            mockRequest = {
                body: {
                    name: 'testName'
                }
            };
        });

        it('Should call created with received data', async () => {
            const group = {
                id: '6a610de4-d99e-4a2b-a265-fec7c472e397',
                name: 'testName',
                users: []
            };

            mockedGroupService.createGroup.mockResolvedValueOnce(group);

            await createGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.created).toBeCalledTimes(1);
            expect(mockedResponses.created).toBeCalledWith(
                mockRequest,
                mockResponse,
                group
            );
            expect(mockNext).not.toBeCalled();
        });

        it('Should handle errors being thrown', async () => {
            mockedGroupService.createGroup.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await createGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.created).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
        });
    });

    describe('getGroup', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    groupId: '34c48a24-311e-412b-9716-e71f177ee6c4'
                }
            };
        });

        it('Should call ok with received data', async () => {
            const group = {
                id: '302712a3-9481-4b11-8477-d7832cc7d525',
                name: 'testName',
                users: ['ca5edae7-aa7b-4d63-917a-17bc26226edc']
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

    describe('getGroups', () => {
        it('Should call ok with received data', async () => {
            const groups = [
                {
                    id: '302712a3-9481-4b11-8477-d7832cc7d525',
                    name: 'testName 1'
                },
                {
                    id: '064f626c-4ba1-4139-b0da-e4d4e5d38df1',
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

    describe('updateGroup', () => {
        beforeEach(() => {
            mockRequest = {
                body: {
                    name: 'testName'
                },
                params: {
                    groupId: '4481923c-797d-4af7-abff-11d8c1b54767'
                }
            };
        });

        it('Should return not found if the group was not found', async () => {
            mockedGroupService.updateGroup.mockResolvedValueOnce(null);

            await updateGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.notFound).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should return ok with updated group data', async () => {
            const response = {
                id: 'fddde05a-7646-44e4-87c3-132cb56a9e7c',
                name: 'group'
            };

            mockedGroupService.updateGroup.mockResolvedValueOnce(response);

            await updateGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.notFound).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should handle errors being thrown', async () => {
            mockedGroupService.updateGroup.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await updateGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
        });
    });

    describe('deleteGroup', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    groupId: '4481923c-797d-4af7-abff-11d8c1b54767'
                }
            };
        });

        it('Should return not found if the group was not found', async () => {
            mockedGroupService.deleteGroup.mockResolvedValueOnce(null);

            await deleteGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.notFound).toBeCalledTimes(1);
            expect(mockedResponses.badRequest).not.toBeCalled();
            expect(mockedResponses.noContent).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should return bad request if there are users in the group', async () => {
            mockedGroupService.deleteGroup.mockResolvedValueOnce(false);

            await deleteGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.badRequest).toBeCalledTimes(1);
            expect(mockedResponses.notFound).not.toBeCalled();
            expect(mockedResponses.noContent).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should return no content if successful', async () => {
            mockedGroupService.deleteGroup.mockResolvedValueOnce(true);

            await deleteGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.noContent).toBeCalledTimes(1);
            expect(mockedResponses.notFound).not.toBeCalled();
            expect(mockedResponses.badRequest).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should handle errors being thrown', async () => {
            mockedGroupService.deleteGroup.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await deleteGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.noContent).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
        });
    });

    describe('addUsersToGroup', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    groupId: '4481923c-797d-4af7-abff-11d8c1b54767'
                },
                body: [
                    '9b020c1b-e0dc-4ac8-b0d5-0ac20efcc9bb',
                    '3d3140a7-c570-4c1c-8ca0-046cb19e4761'
                ]
            };
        });

        it('Should return not found if the group was not found', async () => {
            mockedGroupService.addUsersToGroup.mockResolvedValueOnce(null);

            await addUsersToGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.notFound).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockedResponses.badRequest).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should return bad request if all users dont exist', async () => {
            mockedGroupService.addUsersToGroup.mockResolvedValueOnce(false);

            await addUsersToGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.badRequest).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockedResponses.notFound).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should return ok with group data if successful', async () => {
            const response = {
                id: '4481923c-797d-4af7-abff-11d8c1b54767',
                name: 'group',
                users: [
                    '9b020c1b-e0dc-4ac8-b0d5-0ac20efcc9bb',
                    '3d3140a7-c570-4c1c-8ca0-046cb19e4761'
                ]
            };

            mockedGroupService.addUsersToGroup.mockResolvedValueOnce(response);

            await addUsersToGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                response
            );
            expect(mockedResponses.notFound).not.toBeCalled();
            expect(mockedResponses.badRequest).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should handle errors being thrown', async () => {
            mockedGroupService.addUsersToGroup.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await addUsersToGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
        });
    });

    describe('removeUserFromGroup', () => {
        beforeEach(() => {
            mockRequest = {
                body: {
                    name: 'testName'
                },
                params: {
                    groupId: '4481923c-797d-4af7-abff-11d8c1b54767'
                }
            };
        });

        it('Should return bad request if user not in group', async () => {
            mockedGroupService.removeUserFromGroup.mockResolvedValueOnce(null);

            await removeUserFromGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.badRequest).toBeCalledTimes(1);
            expect(mockedResponses.noContent).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should return no content if successful', async () => {
            mockedGroupService.removeUserFromGroup.mockResolvedValueOnce(true);

            await removeUserFromGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.noContent).toBeCalledTimes(1);
            expect(mockedResponses.badRequest).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should handle errors being thrown', async () => {
            mockedGroupService.removeUserFromGroup.mockImplementationOnce(
                () => {
                    throw new Error('test error');
                }
            );

            await removeUserFromGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.noContent).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(new Error('test error'));
        });
    });
});
