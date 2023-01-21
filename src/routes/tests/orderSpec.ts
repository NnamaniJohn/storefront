import supertest from 'supertest';
import app from '../../server';

const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe('Test responses from endpoints', (): void => {
    describe('endpoint: /orders', (): void => {
        it('gets /orders', async (): Promise<void> => {
            const response: supertest.Response = await request.get('/orders');

            expect(response.status).toBe(200);
        });
    });
});
