import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { initializeConsumer } from './consumer/initializeConsumer';

initializeConsumer();

const app = express();

app.use(express.json());


const port = process.env.PORT || 3005;

app.listen(port, () => {
    console.log(`---Servidor corriendo en el puerto ${port}---`);
});



