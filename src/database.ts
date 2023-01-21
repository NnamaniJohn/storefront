import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
    PG_HOST,
    PG_DATABASE,
    PG_DATABASE_TEST,
    PG_USER,
    PG_PASSWORD,
    ENV,
} = process.env;

let client:Pool
console.log(ENV)

if(ENV === 'test') {
    client = new Pool({
        user: PG_USER,
        host: PG_HOST,
        database: PG_DATABASE_TEST,
        password: PG_PASSWORD,
    })
}

if(ENV === 'dev') {
    client = new Pool({
        user: PG_USER,
        host: PG_HOST,
        database: PG_DATABASE,
        password: PG_PASSWORD,
    })
}

// @ts-ignore
export default client;