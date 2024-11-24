import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import historyRouter from './infrastructure/routes/HistoryRoutes';

const app = express();

app.use(express.json());

app.use('/', historyRouter);


const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log(`---Servidor corriendo en el puerto ${port}---`);
});