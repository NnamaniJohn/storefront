import client from "../database";

export type Order = {
    id?: number,
    status: string,
    user_id: number,
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM orders'
            const result = await conn.query(sql)
            await conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async show(id: number): Promise<Order> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM orders WHERE id = ($1)'
            const result = await conn.query(sql, [id])
            await conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async create(order: Order): Promise<Order> {
        try {
            const conn = await client.connect()
            const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *'
            const result = await conn.query(sql, [order.status, order.user_id])
            await conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async update(order: Order): Promise<Order> {
        try {
            const conn = await client.connect()
            const sql = 'UPDATE orders SET status = ($1), user_id = ($2) WHERE id = ($3) RETURNING *'
            const result = await conn.query(sql, [order.status, order.user_id, order.id])
            await conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async delete(id:number): Promise<Order> {
        try {
            const conn = await client.connect()
            const sql = 'DELETE FROM orders WHERE id = ($1) RETURNING *'
            const result = await conn.query(sql, [id])
            await conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async addProduct(quantity: number, orderId: string, productId: string) {
        // get order to see if it is active
        try {
            const ordersql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await client.connect()

            const result = await conn.query(ordersql, [orderId])

            const order = result.rows[0]

            if (order.status !== "active") {
                throw new Error(`Could not add product ${productId} to order ${orderId} because order status is ${order.status}`)
            }

            conn.release()
        } catch (err) {
            throw new Error(`${err}`)
        }

        try {
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
            const conn = await client.connect()

            const result = await conn
                .query(sql, [quantity, orderId, productId])

            const order = result.rows[0]

            conn.release()

            return order
        } catch (err) {
            throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
        }
    }

    async listProducts(orderId: string) {
        // get order to see if it is active
        try {
            const ordersql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await client.connect()

            const result = await conn.query(ordersql, [orderId])

            const order = result.rows[0]

            if (order.status !== "active") {
                throw new Error(`Could not list products in order ${orderId} because order status is ${order.status}`)
            }

            conn.release()
        } catch (err) {
            throw new Error(`${err}`)
        }

        try {
            const sql = 'SELECT * FROM order_products WHERE order_id = ($1)'
            const conn = await client.connect()

            const result = await conn
                .query(sql, [orderId])

            const order = result.rows

            conn.release()

            return order
        } catch (err) {
            throw new Error(`Could not list products in order ${orderId}: ${err}`)
        }
    }

    async removeProduct(orderId: string, productId: string) {
        // get order to see if it is active
        try {
            const ordersql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await client.connect()

            const result = await conn.query(ordersql, [orderId])

            const order = result.rows[0]

            if (order.status !== "active") {
                throw new Error(`Could not remove product ${productId} to order ${orderId} because order status is ${order.status}`)
            }

            conn.release()
        } catch (err) {
            throw new Error(`${err}`)
        }

        try {
            const sql = 'DELETE FROM order_products WHERE order_id = ($1) AND product_id = ($2) RETURNING *'
            const conn = await client.connect()

            const result = await conn
                .query(sql, [orderId, productId])

            const order = result.rows[0]

            conn.release()

            return order
        } catch (err) {
            throw new Error(`Could not remove product ${productId} to order ${orderId}: ${err}`)
        }
    }

    async userOrder(user_id: number): Promise<Order> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM orders WHERE user_id = ($1) and status = ($2)'
            const result = await conn.query(sql, [user_id, 'active'])
            await conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }
}