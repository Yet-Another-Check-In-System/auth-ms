import { NextFunction, Request, Response } from 'express';

import * as service from '../services/permissionService';
import * as responses from '../utils/responses';
import * as controller from './healthController';

jest.mock('../utils/logger');
jest.mock('../services/permissionService');
jest.mock('../utils/responses');

const mockedService = jest.mocked(service);
const mockedResponses = jest.mocked(responses);

describe('healthController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getUserPermission', () => {
        it.todo('Should return not found when user is not found');

        it.todo('Should return ok with permissions');

        it.todo('Should call next with error when error thrown');
    });

    describe('getGroupPermission', () => {
        it.todo('Should return not found when group is not found');

        it.todo('Should return ok with permissions');

        it.todo('Should call next with error when error thrown');
    });

    describe('addPermissionsToGroup', () => {
        it.todo('Should return not found when group is not found');

        it.todo('Should return ok with permissions');

        it.todo('Should call next with error when error thrown');
    });

    describe('removePermissionsFromGroup', () => {
        it.todo('Should return not found when group is not found');

        it.todo('Should return ok with permissions');

        it.todo('Should call next with error when error thrown');
    });

    describe('removePermissionsFromGroup', () => {
        it.todo('Should return empty array of permissions');

        it.todo('Should return ok with permissions');

        it.todo('Should call next with error when error thrown');
    });
});
