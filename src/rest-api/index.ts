import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { getPlayer } from '../hofornot/api/get-player';
import { postVote } from '../hofornot/api/post-vote';

dotenv.config();

const openDatabasePool = (host: string, password: string, database: string, user: string) => new Pool({
    host,
    user,
    port: 5432,
    database,
    password,
    ssl: true,
});

export const EnvConfig = {
    environment: process.env.ENVIRONMENT,
    readDatabasePool: openDatabasePool(
        process.env.POSTGRES_READ_DB_HOST ?? '',
        process.env.POSTGRES_PASSWORD ?? '',
        process.env.POSTGRES_DB ?? '',
        process.env.POSTGRES_USER ?? '',
    ),
    writeDatabasePool: openDatabasePool(
        process.env.POSTGRES_WRITE_DB_HOST ?? '',
        process.env.POSTGRES_PASSWORD ?? '',
        process.env.POSTGRES_DB ?? '',
        process.env.POSTGRES_USER ?? '',
    ),
};


export const createServer = () => {
    if (!process.env.ENVIRONMENT) {
        return new Error('env variable ENVIRONMENT not set');
    }

    const server = express();
    const cookieParser = require('cookie-parser');
    /*
        multiple origin example
        app.use(cors({
            origin: ['http://localhost:3000', 'https://yourproductiondomain.com']
        }));
    */
    server.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }));
    server.use(express.json());
    server.use(cookieParser());

    server.get('/players/:playerId/', getPlayer);
    server.post('/votes', postVote);
    
    return server.listen(8080, () => {
        console.info(`HOF or Not listening on http://localhost:8080`);
    });
}