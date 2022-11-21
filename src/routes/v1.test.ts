import { Router } from 'express';
import router from './v1';

describe('router', () => {
    describe('v1', () => {
        it('Should return router', () => {
            expect(typeof router).toEqual(typeof Router);
        });
    });
});
