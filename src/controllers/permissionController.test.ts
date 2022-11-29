import { NextFunction, Request, Response } from 'express';

import * as service from '../services/permissionService';
import * as responses from '../utils/responses';
import * as controller from './permissionController';

jest.mock('../utils/logger');
jest.mock('../services/permissionService');
jest.mock('../utils/responses');

const mockedService = jest.mocked(service);
const mockedResponses = jest.mocked(responses);

describe('permissionController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getUserPermission', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    userId: '74d5e843-bbb2-427d-9216-7c0735afcea3'
                }
            };
        });

        it('Should return not found when user is not found', async () => {
            mockedService.getUserPermission.mockResolvedValueOnce(null);

            await controller.getUserPermission(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.notFound).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should return ok with permissions', async () => {
            const permissions = ['admin.test.read', 'admin.test.write'];

            mockedService.getUserPermission.mockResolvedValueOnce(permissions);

            await controller.getUserPermission(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                {
                    id: '74d5e843-bbb2-427d-9216-7c0735afcea3',
                    permissions: permissions
                }
            );
            expect(mockedResponses.notFound).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should call next with error when error thrown', async () => {
            mockedService.getUserPermission.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await controller.getUserPermission(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
        });
    });

    describe('getGroupPermission', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    groupId: '73a464a2-3baf-4662-b861-c503343304ee'
                }
            };
        });

        it('Should return not found when group is not found', async () => {
            mockedService.getGroupPermission.mockResolvedValueOnce(null);

            await controller.getGroupPermission(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.notFound).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should return ok with permissions', async () => {
            const permissions = ['admin.test.write', 'admin.test.read'];

            mockedService.getGroupPermission.mockResolvedValueOnce(permissions);

            await controller.getGroupPermission(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                {
                    id: '73a464a2-3baf-4662-b861-c503343304ee',
                    permissions: permissions
                }
            );
            expect(mockedResponses.notFound).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should call next with error when error thrown', async () => {
            mockedService.getGroupPermission.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await controller.getGroupPermission(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
        });
    });

    describe('addPermissionsToGroup', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    groupId: '73a464a2-3baf-4662-b861-c503343304ee'
                }
            };
        });

        it('Should return not found when group is not found', async () => {
            mockedService.addPermissionsToGroup.mockResolvedValueOnce(null);

            await controller.addPermissionsToGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.notFound).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should return ok with permissions', async () => {
            const permissions = ['admin.test.write', 'admin.test.read'];

            mockedService.addPermissionsToGroup.mockResolvedValueOnce(true);
            mockedService.getGroupPermission.mockResolvedValueOnce(permissions);

            await controller.addPermissionsToGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                {
                    id: '73a464a2-3baf-4662-b861-c503343304ee',
                    permissions: permissions
                }
            );
            expect(mockedResponses.notFound).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should call next with error when error thrown', async () => {
            mockedService.addPermissionsToGroup.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await controller.addPermissionsToGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
        });
    });

    describe('removePermissionsFromGroup', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    groupId: '73a464a2-3baf-4662-b861-c503343304ee'
                }
            };
        });

        it('Should return not found when group is not found', async () => {
            mockedService.removePermissionsFromGroup.mockResolvedValueOnce(
                null
            );

            await controller.removePermissionsFromGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.notFound).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should return ok with permissions', async () => {
            const permissions = ['admin.test.write', 'admin.test.read'];

            mockedService.removePermissionsFromGroup.mockResolvedValueOnce(
                true
            );
            mockedService.getGroupPermission.mockResolvedValueOnce(permissions);

            await controller.removePermissionsFromGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                {
                    id: '73a464a2-3baf-4662-b861-c503343304ee',
                    permissions: permissions
                }
            );
            expect(mockedResponses.notFound).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        it('Should call next with error when error thrown', async () => {
            mockedService.removePermissionsFromGroup.mockImplementationOnce(
                () => {
                    throw new Error('test error');
                }
            );

            await controller.removePermissionsFromGroup(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
        });
    });

    describe('getAllPermissions', () => {
        it('Should return empty array of permissions', async () => {
            mockedService.getAllPermissions.mockResolvedValueOnce([]);

            await controller.getAllPermissions(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                { permissions: [] }
            );
        });

        it('Should return ok with permissions', async () => {
            const permissions = [
                {
                    id: '0ce2164e-a7c4-4b5c-b531-1727e432150d',
                    name: 'test.first'
                },
                {
                    id: '5d92c8a5-a566-4524-aa48-fc70d7fe0d0a',
                    name: 'test.second'
                }
            ];

            mockedService.getAllPermissions.mockResolvedValueOnce(permissions);

            await controller.getAllPermissions(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedResponses.ok).toBeCalledTimes(1);
            expect(mockedResponses.ok).toBeCalledWith(
                mockRequest,
                mockResponse,
                { permissions: permissions }
            );
        });

        it('Should call next with error when error thrown', async () => {
            mockedService.getAllPermissions.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await controller.getAllPermissions(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockedResponses.ok).not.toBeCalled();
        });
    });
});
