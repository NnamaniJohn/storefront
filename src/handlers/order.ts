import {Request, Response} from "express";
import {Order, OrderStore} from "../models/order";

export class OrderHandler {
    async index(req: Request, res: Response) {
        try {
            const store = new OrderStore()
            const orders = await store.index()
            res.send(orders)
        } catch (err) {
            res.send(`an error occur${err}`)
        }
    }

    async show(req: Request, res: Response) {
        const id = Number(req.params.id)
        const store = new OrderStore()
        const order = await store.show(id)
        res.send(order)
    }

    async create(req: Request, res: Response) {
        try {
            const order: Order = {
                status: String(req.body.status),
                //@ts-ignore
                user_id: Number(req.user.id),
            }
            const store = new OrderStore()
            const result = await store.create(order)
            res.send(result)
        } catch (err) {
            res.send(`an error occur${err}`)
        }
    }

    async edit(req: Request, res: Response) {
        const order: Order = {
            id: Number(req.params.id),
            status: String(req.body.status),
            user_id: Number(req.body.user_id),
        }
        const store = new OrderStore
        const result = await store.update(order);
        res.send(result)
    }

    async delete(req: Request, res: Response) {
        const id = Number(req.params.id)
        const store = new OrderStore
        const result = await store.delete(id);
        res.send(result)
    }

    async addProduct(_req: Request, res: Response) {
        const store = new OrderStore()
        const orderId: string = _req.params.id
        const productId: string = _req.body.product_id
        const quantity: number = parseInt(_req.body.quantity)

        try {
            const addedProduct = await store.addProduct(quantity, orderId, productId)
            res.json(addedProduct)
        } catch(err) {
            res.status(400)
            res.json(err)
        }
    }

    async removeProduct(_req: Request, res: Response) {
        const store = new OrderStore()
        const orderId: string = _req.params.id
        const productId: string = _req.body.product_id

        try {
            const prod = await store.removeProduct(orderId, productId)
            res.json(prod)
        } catch(err) {
            res.status(400)
            res.json(err)
        }
    }

    async userOrder(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            const store = new OrderStore()
            const order = await store.show(id)
            res.send(order)
        } catch (err) {
            res.send(`an error occur${err}`)
        }
    }
}