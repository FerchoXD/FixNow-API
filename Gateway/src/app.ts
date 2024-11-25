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
const IPA = process.env.IPA || 'localhost';
const DNS = process.env.DNS;

app.use('/api/v1/auth', proxy({ target: 'http://auth:3000', changeOrigin: true }));
app.use('/api/v1/history', proxy({ target: 'http://history:3000', changeOrigin: true }));
app.use('/api/v1/forum', proxy({ target: 'http://forum:3000', changeOrigin: true }));

app.listen(PORT,() => {
    signale.success(`SERVER RUNNING IN http://localhost:3000`);
});