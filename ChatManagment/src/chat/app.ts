import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import messageRoutes from './infrastructure/routes/ChatRoutes';
import { createServer } from 'http';
import { initializeSocketServer } from './infrastructure/services/socketIO/server';

export const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/',messageRoutes)

const httpServer = createServer(app);
export const io = initializeSocketServer(httpServer);

const PORT = process.env.PORT || 3004;

httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

