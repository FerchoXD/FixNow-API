import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import paymentRouter from './infrastructure/routes/PaymentRouter';

const app = express();

app.use(express.json());

app.use('/', paymentRouter);


const port = process.env.PORT || 3005;

app.listen(port, () => {
    console.log(`---Servidor corriendo en el puerto ${port}---`);
});