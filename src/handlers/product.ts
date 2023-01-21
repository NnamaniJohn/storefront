import {Request, Response} from "express";
import {Product, ProductStore} from "../models/product";

export class ProductHandler {
    async index(req: Request, res: Response) {
        try {
            const store = new ProductStore()
            const products = await store.index()
            res.send(products)
        } catch (err) {
            res.send(`an error occur${err}`)
        }
    }

    async show(req: Request, res: Response) {
        const id = Number(req.params.id)
        const store = new ProductStore()
        const product = await store.show(id)
        res.send(product)
    }

    async create(req: Request, res: Response) {
        const product: Product = {
            name: String(req.body.name),
            price: Number(req.body.price),
            category: String(req.body.category)
        }
        const store = new ProductStore()
        const result = await store.create(product)
        res.send(result)
    }

    async edit(req: Request, res: Response) {
        const product: Product = {
            id: Number(req.params.id),
            name: String(req.body.name),
            price: Number(req.body.price),
            category: String(req.body.category)
        }
        const store = new ProductStore
        const result = await store.update(product);
        res.send(result)
    }

    async delete(req: Request, res: Response) {
        const id = Number(req.params.id)
        const store = new ProductStore
        const result = await store.delete(id);
        res.send(result)
    }
}