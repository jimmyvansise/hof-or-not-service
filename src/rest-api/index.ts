import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import http from 'http';
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
    server.get('/players/:playerId/', getPlayer);
    server.post('/votes', postVote);

    const httpServer = http.createServer(server);

    httpServer.timeout = 66000;
    httpServer.keepAliveTimeout = 65000;
    
    return httpServer.listen(8080, () => {
        console.info('HOF or Not listening on http://localhost:8080');
    });
  
    /*
    let options;
    if (process.env.ENVIRONMENT === 'production') {
        options = {
            key: fs.readFileSync('./keys/private-production.key', 'utf8'),
            cert: fs.readFileSync('./keys/cert-production.crt', 'utf8')
        };
    }
    else if (process.env.ENVIRONMENT === 'developmentSSL') {
        options = {
            key: fs.readFileSync('./cert/private-dev.key'),
            cert: fs.readFileSync('./cert/cert-dev.crt')
        }
    }
    else {
    }

    const httpsServer = https.createServer(options, server);

    return httpsServer.listen(443, () => {
        console.info('HOF or Not listening on https://localhost:443');
    });
    */
}