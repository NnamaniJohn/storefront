import {Request, Response} from "express";
import {User, UserStore} from "../models/user";
import jwt, {Secret} from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const {
    TOKEN_SECRET
} = process.env;

export class UserHandler {
    async index(req: Request, res: Response) {
        try {
            const store = new UserStore()
            const users = await store.index()
            res.send(users)
        } catch (err) {
            res.send(`an error occur${err}`)
        }
    }

    async show(req: Request, res: Response) {
        const id = Number(req.params.id)
        const store = new UserStore()
        const user = await store.show(id)
        res.send(user)
    }

    async create(req: Request, res: Response) {
        const user: User = {
            firstname: String(req.body.firstname),
            lastname: String(req.body.lastname),
            password: String(req.body.password)
        }

        try {
            const store = new UserStore()
            const result = await store.create(user)
            var token = jwt.sign({ user: result }, TOKEN_SECRET  as Secret);
            res.json(token)
        } catch(err) {
            res.status(400)
            res.json(err as string + user)
        }
    }

    async edit(req: Request, res: Response) {
        const user: User = {
            id: Number(req.params.id),
            firstname: String(req.body.firstname),
            lastname: String(req.body.lastname),
            password: String(req.body.password)
        }
        const store = new UserStore
        const result = await store.update(user);
        res.send(result)
    }

    async delete(req: Request, res: Response) {
        const id = Number(req.params.id)
        const store = new UserStore
        const result = await store.delete(id);
        res.send(result)
    }

    async signIn(req: Request, res: Response) {
        try {
            const user: User = {
                firstname: String(req.body.firstname),
                lastname: String(req.body.lastname),
                password: String(req.body.password)
            }
            const store = new UserStore()
            const result = await store.authenticate(user)
            if (result) {
                var token = jwt.sign({ user: result }, TOKEN_SECRET as Secret)
                res.json(token)
            } else {
                throw new Error('Access denied, invalid user')
            }
        } catch(err) {
            res.status(401)
            res.json('Access denied, invalid user')
        }
    }
}