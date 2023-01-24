import client from "../database";

export type Product = {
    id?: number,
    name: string,
    price: number,
    category: string
}

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM products'
            const result = await conn.query(sql)
            await conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM products WHERE id = ($1)'
            const result = await conn.query(sql, [id])
            await conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async create(product: Product): Promise<Product> {
        try {
            const conn = await client.connect()
            const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *'
            const result = await conn.query(sql, [product.name, product.price, product.category])
            await conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async update(product: Product): Promise<Product> {
        try {
            const conn = await client.connect()
            const sql = 'UPDATE products SET name = ($1), price = ($2), category = ($3) WHERE id = ($4) RETURNING *'
            const result = await conn.query(sql, [product.name, product.price, product.category, product.id])
            await conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async delete(id:number): Promise<Product> {
        try {
            const conn = await client.connect()
            const sql = 'DELETE FROM products WHERE id = ($1) RETURNING *'
            const result = await conn.query(sql, [id])
            await conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }
}