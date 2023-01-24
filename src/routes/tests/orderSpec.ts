import supertest from 'supertest';
import app from '../../server';
import jwt, {Secret} from "jsonwebtoken";
import dotenv from 'dotenv';
import {Order} from "../../models/order";
import {Product} from "../../models/product";

dotenv.config();

const {
    TOKEN_SECRET
} = process.env;

const request: supertest.SuperTest<supertest.Test> = supertest(app);

let token: string;
let order: Order;
let product: Product;

describe('Test responses from endpoints', (): void => {
    beforeAll(async (): Promise<void> => {
        const response: supertest.Response = await request.post('/users/create').send({
            firstname: 'Paul',
            lastname: 'Adam',
            password: 'password'
        });
        token = response.body;
        const response2: supertest.Response = await request.post('/products/create').send({
            name: 'Apple',
            price: 200,
            category: 'Fruits'
        }).set('Authorization', `Bearer ${token}`);
        product = response2.body
    });

    describe('endpoint: /orders/create', (): void => {
        it('posts /orders/create with token', async (): Promise<void> => {
            // @ts-ignore
            const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
            const response: supertest.Response = await request.post('/orders/create').send({
                status: 'active',
                user_id: user.id
            }).set('Authorization', `Bearer ${token}`);
            order = response.body

            expect(response.status).toBe(200);
        });

        it('posts /orders/create without token', async (): Promise<void> => {
            // @ts-ignore
            const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
            const response: supertest.Response = await request.post('/orders/create').send({
                status: 'active',
                user_id: user.id
            });

            expect(response.status).toBe(401);
        });
    });

    describe('endpoint: /orders', (): void => {
        it('gets /orders', async (): Promise<void> => {
            const response: supertest.Response = await request.get('/orders');

            expect(response.status).toBe(200);
        });
    });

    describe('endpoint: /orders/:orderId/show', (): void => {
        it('gets /orders/:orderId/show', async (): Promise<void> => {
            const response: supertest.Response = await request.get(`/orders/${order.id}/show`);

            expect(response.status).toBe(200);
        });
    });

    describe('endpoint: /orders/user/:orderId/show', (): void => {
        it('gets /orders/user/:orderId/show', async (): Promise<void> => {
            const response: supertest.Response = await request.get(`/orders/user/${order.id}/show`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    describe('endpoint: /orders/:orderId/products', (): void => {
        it('posts /orders/:orderId/products', async (): Promise<void> => {
            const response: supertest.Response = await request.post(`/orders/${order.id}/products`).send({
                quantity: 20,
                order_id: '1',
                product_id: product.id
            }).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    describe('endpoint: /orders/:orderId/products', (): void => {
        it('deletes /orders/:orderId/products', async (): Promise<void> => {
            const response: supertest.Response = await request.delete(`/orders/${order.id}/products/delete`).send({
                product_id: product.id
            }).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    describe('endpoint: /orders/:orderId/update', (): void => {
        it('puts /orders/:orderId/update with token', async (): Promise<void> => {
            // @ts-ignore
            const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
            const response: supertest.Response = await request.put(`/orders/${order.id}/update`).send({
                status: 'completed',
                user_id: user.id
            }).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

        it('puts /orders/:orderId/update with token', async (): Promise<void> => {
            // @ts-ignore
            const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
            const response: supertest.Response = await request.put(`/orders/${order.id}/update`).send({
                status: 'completed',
                user_id: user.id
            });

            expect(response.status).toBe(401);
        });
    });

    describe('endpoint: /orders/:orderId/delete', (): void => {
        it('deletes /orders/:orderId/delete with token', async (): Promise<void> => {
            const response: supertest.Response = await request.delete(`/orders/${order.id}/delete`);

            expect(response.status).toBe(401);
        });

        it('deletes /orders/:orderId/delete with token', async (): Promise<void> => {
            const response: supertest.Response = await request.delete(`/orders/${order.id}/delete`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    afterAll(async (): Promise<void> => {
        // @ts-ignore
        const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
        const response: supertest.Response = await request.delete(`/users/${user.id}/delete`).set('Authorization', `Bearer ${token}`);
        const response2: supertest.Response = await request.delete(`/products/${product.id}/delete`).set('Authorization', `Bearer ${token}`);
    });
});
