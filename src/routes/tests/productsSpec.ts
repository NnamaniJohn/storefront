import supertest from 'supertest';
import app from '../../server';
import jwt, {Secret} from "jsonwebtoken";
import dotenv from 'dotenv';
import {Product} from "../../models/product";

dotenv.config();

const {
    TOKEN_SECRET
} = process.env;

const request: supertest.SuperTest<supertest.Test> = supertest(app);

let token: string;
let product: Product;

describe('Test responses from endpoints', (): void => {
    beforeAll(async (): Promise<void> => {
        const response: supertest.Response = await request.post('/users/create').send({
            firstname: 'Paul',
            lastname: 'Adam',
            password: 'password'
        });
        token = response.body;
    });

    describe('endpoint: /products/create', (): void => {
        it('posts /products/create with token', async (): Promise<void> => {
            const response: supertest.Response = await request.post('/products/create').send({
                name: 'Apple',
                price: 200,
                category: 'Fruits'
            }).set('Authorization', `Bearer ${token}`);
            product = response.body

            expect(response.status).toBe(200);
        });

        it('posts /products/create without token', async (): Promise<void> => {
            const response: supertest.Response = await request.post('/products/create').send({
                name: 'Apple',
                price: 200,
                category: 'Fruits'
            });

            expect(response.status).toBe(401);
        });
    });

    describe('endpoint: /products', (): void => {
        it('gets /products', async (): Promise<void> => {
            const response: supertest.Response = await request.get('/products');

            expect(response.status).toBe(200);
        });
    });

    describe('endpoint: /products/:productId/show', (): void => {
        it('gets /products/:productId/show', async (): Promise<void> => {
            const response: supertest.Response = await request.get(`/products/${product.id}/show`);

            expect(response.status).toBe(200);
        });
    });

    describe('endpoint: /products/:productId/update', (): void => {
        it('puts /products/:productId/update with token', async (): Promise<void> => {
            const response: supertest.Response = await request.put(`/products/${product.id}/update`).send({
                name: 'Orange',
                price: 200,
                category: 'Fruits'
            }).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

        it('puts /products/:productId/update with token', async (): Promise<void> => {
            const response: supertest.Response = await request.put(`/products/${product.id}/update`).send({
                name: 'Orange',
                price: 200,
                category: 'Fruits'
            });

            expect(response.status).toBe(401);
        });
    });

    describe('endpoint: /products/:productId/delete', (): void => {
        it('deletes /products/:productId/delete with token', async (): Promise<void> => {
            const response: supertest.Response = await request.delete(`/products/${product.id}/delete`);

            expect(response.status).toBe(401);
        });

        it('deletes /products/:productId/delete with token', async (): Promise<void> => {
            const response: supertest.Response = await request.delete(`/products/${product.id}/delete`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    afterAll(async (): Promise<void> => {
        // @ts-ignore
        const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
        const response: supertest.Response = await request.delete(`/users/${user.id}/delete`).set('Authorization', `Bearer ${token}`);
    });
});
