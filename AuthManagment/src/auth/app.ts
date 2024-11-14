import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import userRouter from './infraestructure/routes/UserRoutes';

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const app = express();
app.use(express.json());
app.use('/api/v1/users', userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`---Servidor corriendo en el puerto ${port}---`);
});
