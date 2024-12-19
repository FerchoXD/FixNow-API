import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import virtualAsistant from './infrastructure/routes/VirtualAssistantRoute';

const app = express();

app.use(express.json());

app.use('/', virtualAsistant);


const port = process.env.PORT || 3007;

app.listen(port, () => {
    console.log(`---Servidor corriendo en el puerto ${port}---`);
});