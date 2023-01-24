import supertest from 'supertest';
import app from '../../server';
import jwt, {Secret} from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const {
    TOKEN_SECRET
} = process.env;

const request: supertest.SuperTest<supertest.Test> = supertest(app);

let token: string;

describe('Test responses from User endpoints', (): void => {
    describe('endpoint: /users/create', (): void => {
        it('posts /users/create', async (): Promise<void> => {
            const response: supertest.Response = await request.post('/users/create').send({
                firstname: 'Paul',
                lastname: 'Adam',
                password: 'password'
            });
            token = response.body;

            expect(response.status).toBe(200);
        });
    });

    describe('endpoint: /users/sign_in', (): void => {
        it('posts /users/sign_in', async (): Promise<void> => {
            const response: supertest.Response = await request.post('/users/sign_in').send({
                firstname: 'Paul',
                lastname: 'Adam',
                password: 'password'
            });

            expect(response.status).toBe(200);
        });
    });

    describe('endpoint: /users', (): void => {
        it('gets /users with token', async (): Promise<void> => {
            const response: supertest.Response = await request.get('/users', ).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

        it('gets /users without token', async (): Promise<void> => {
            const response: supertest.Response = await request.get('/users', )

            expect(response.status).toBe(401);
        });
    });

    describe('endpoint: /users/:userId/show', (): void => {
        it('gets /users/:userId/show', async (): Promise<void> => {
            // @ts-ignore
            const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
            const response: supertest.Response = await request.get(`/users/${user.id}/show`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

        it('gets /users/:userId/show', async (): Promise<void> => {
            // @ts-ignore
            const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
            const response: supertest.Response = await request.get(`/users/${user.id}/show`);

            expect(response.status).toBe(401);
        });
    });

    describe('endpoint: /users/1/update', (): void => {
        it('puts /users/1/update', async (): Promise<void> => {
            // @ts-ignore
            const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
            const response: supertest.Response = await request.put(`/users/${user.id}/update`).send({
                firstname: 'Sam',
                lastname: 'Gold',
                password: 'password'
            }).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

        it('gets /users/1/update', async (): Promise<void> => {
            // @ts-ignore
            const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
            const response: supertest.Response = await request.put(`/users/${user.id}/update`).send({
                firstname: 'Sam',
                lastname: 'Gold',
                password: 'password'
            });

            expect(response.status).toBe(401);
        });
    });

    describe('endpoint: /users/1/delete', (): void => {
        it('deletes /users/1/delete without token', async (): Promise<void> => {
            // @ts-ignore
            const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
            const response: supertest.Response = await request.delete(`/users/${user.id}/delete`);

            expect(response.status).toBe(401);
        });

        it('deletes /users/1/delete with token', async (): Promise<void> => {
            // @ts-ignore
            const { user } = jwt.verify(token, TOKEN_SECRET as Secret)
            const response: supertest.Response = await request.delete(`/users/${user.id}/delete`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });
});
