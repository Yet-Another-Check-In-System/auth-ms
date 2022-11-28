import * as permissionService from './permissionService';
import { prismaMock } from '../utils/prismaMock';

describe('permissionService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getUserPermission', () => {
        it.todo('Should return null when the user is not found');

        it.todo('Should return all permissions of the user');

        it.todo('Should not handle any errors');
    });

    describe('getGroupPermission', () => {
        it.todo('Should return null when the group is not found');

        it.todo('Should return all permissions for the group');

        it.todo('Should not handle any errors');
    });

    describe('addPermissionsToGroup', () => {
        it.todo('Should return null when the group is not found');

        it.todo('Should return null when all given permissions dont exist');

        it.todo('Should return false when trying to add duplicate permission');

        it.todo('Should return true when permissions are added successfully');

        it.todo('Should not handle any errors');
    });

    describe('removePermissionsFromGroup', () => {
        it.todo('Should return null if the group not found');

        it.todo('Should return true when permissions are removed successfully');

        it.todo('Should not handle any errors');
    });

    describe('getAllPermissions', () => {
        it.todo('Should return all permissions');

        it.todo('Should return empty array when no permissions found');

        it.todo('Should not handle any errors');
    });
});
