import express, { Application } from 'express';
import proxy from 'express-http-proxy';
import morgan from 'morgan';

import dotenv from 'dotenv';
import { Signale } from "signale";

const app:Application = express();
const signale = new Signale();

app.use(morgan('dev'));

dotenv.config();

const PORT = process.env.PORT || 3000;

const SERVICES = {
    AUTH: process.env.AUTH_URL || 'http://127.0.0.1:3001',
    HISTORY: process.env.HISTORY_URL || 'http://127.0.0.1:3002',
    FORUM: process.env.FORUM_URL || 'http://127.0.0.1:3003',
    //CHAT: process.env.CHAT_URL || 'http://127.0.0.1:3004',
    PAYMENT: process.env.PAYMENT_URL || 'http://127.0.0.1:3004',
    RAITING: process.env.RAITING_URL || 'http://127.0.0.1:5000',
};


const createProxy = (target: string) =>
    proxy(target, {
        proxyReqOptDecorator: (proxyReqOpts) => {
            proxyReqOpts.headers = proxyReqOpts.headers || {};
            proxyReqOpts.headers['changeOrigin'] = 'true';
            return proxyReqOpts;
        },
    });

app.use('/api/v1/auth', createProxy(SERVICES.AUTH));
app.use('/api/v1/history', createProxy(SERVICES.HISTORY));
app.use('/api/v1/forum', createProxy(SERVICES.FORUM));
//app.use('/api/v1/chat', createProxy(SERVICES.CHAT));
app.use('/api/v1/payment', createProxy(SERVICES.PAYMENT));
app.use('/api/v1/raiting', createProxy(SERVICES.RAITING));


app.listen(PORT,() => {
    signale.success(`SERVER RUNNING IN http://localhost:3000`);
});