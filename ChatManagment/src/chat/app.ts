import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import forumRoutes from './infrastructure/routes/ChatRoutes';

const app = express();

app.use(express.json());

app.use('/', forumRoutes);


const port = process.env.PORT || 3004;

app.listen(port, () => {
    console.log(`---Servidor corriendo en el puerto ${port}---`);
});