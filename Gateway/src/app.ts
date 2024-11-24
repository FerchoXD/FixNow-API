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

app.use('/api/v1/auth', proxy('http://127.0.0.1:3001'));
app.use('/api/v1/history',proxy('http://127.0.0.1:3002'));

app.listen(PORT,() => {
    signale.success(`SERVER RUNNING IN http://localhost:3000`);
});