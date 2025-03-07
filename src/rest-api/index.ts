import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { getPlayer } from '../hofornot/api/get-player';
import { getPlayerNames } from '../hofornot/api/get-player-names';
import { postVote } from '../hofornot/api/post-vote';

dotenv.config();

const openDatabasePool = (host: string, password: string, database: string, user: string) => new Pool({
    host,
    user,
    port: 5432,
    database,
    password,
    ssl: (process.env.ENVIRONMENT === 'production')
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

    server.use(cors({
        origin: [
            'https://hofornot.app',
            'https://www.hofornot.app',
            'https://master.duaxi8s44iqme.amplifyapp.com',
            'http://localhost:3000',
            'https://localhost:3000',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));
    server.use(express.json());
    server.use(cookieParser());

    server.get('/health', (_, res) => {
        res.status(200).send('HOF service is healthy');
    });

    server.get('/players/names', getPlayerNames);
    server.get('/players/:playerId/', getPlayer);
    server.post('/votes', postVote);
    
    return server.listen(8080, () => {
        console.info('HOF or Not listening on http://localhost:8080');
    });
}