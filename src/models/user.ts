import client from "../database";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';

dotenv.config();

const {
    BCRYPT_PASSWORD,
    SALT_ROUNDS
} = process.env;

export type User = {
    id?: number,
    firstname: string,
    lastname: string,
    password?: string
}

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT id, firstname, lastname FROM users'
            const result = await conn.query(sql)
            await conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async show(id: number): Promise<User> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT id, firstname, lastname FROM users WHERE id = ($1)'
            const result = await conn.query(sql, [id])
            await conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async create(user: User): Promise<User> {
        try {
            // @ts-ignore
            const hash = bcrypt.hashSync(user.password + BCRYPT_PASSWORD, parseInt(SALT_ROUNDS as string))
            const conn = await client.connect()
            const sql = 'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *'
            const result = await conn.query(sql, [user.firstname, user.lastname, hash])
            await conn.release()
            return {
                id: result.rows[0].id,
                firstname: result.rows[0].firstname,
                lastname: result.rows[0].lastname
            }
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async update(user: User): Promise<User> {
        try {
            const conn = await client.connect()
            const sql = 'UPDATE users SET firstname = ($1), lastname = ($2), password = ($3) WHERE id = ($4) RETURNING *'
            const result = await conn.query(sql, [user.firstname, user.lastname, user.password, user.id])
            await conn.release()
            return {
                firstname: result.rows[0].firstname,
                lastname: result.rows[0].lastname
            }
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async delete(id:number): Promise<User> {
        try {
            const conn = await client.connect()
            const sql = 'DELETE FROM users WHERE id = ($1) RETURNING *'
            const result = await conn.query(sql, [id])
            await conn.release()
            return {
                id: result.rows[0].id,
                firstname: result.rows[0].firstname,
                lastname: result.rows[0].lastname
            }
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }

    async authenticate(user: User): Promise<User | null> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM users WHERE firstname = ($1) AND lastname = ($2)'
            const result = await conn.query(sql, [user.firstname, user.lastname])
            await conn.release()

            if (result.rows.length > 0) {
                const auth = result.rows[0]
                // @ts-ignore
                if (bcrypt.compareSync(user.password + BCRYPT_PASSWORD, auth.password)) {
                    return {
                        id: auth.id,
                        firstname: auth.firstname,
                        lastname: auth.lastname
                    }
                }
            }
            return null
        } catch (err) {
            throw new Error(`an error occur${err}`)
        }
    }
}