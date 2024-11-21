import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import passport from 'passport';
import session from 'express-session';
import userRouter from './infraestructure/routes/UserRoutes';

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const app = express();
app.use(session({
  secret: process.env.GOOGLE_SECRET_SESSION as string,
  resave: false,
  saveUninitialized: false,
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1/users', userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`---Servidor corriendo en el puerto ${port}---`);
});
