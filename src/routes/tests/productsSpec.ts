import supertest from 'supertest';
import app from '../../server';

const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe('Test responses from endpoints', (): void => {
    describe('endpoint: /products', (): void => {
        it('gets /products', async (): Promise<void> => {
            const response: supertest.Response = await request.get('/products');

            expect(response.status).toBe(200);
        });
    });
});
