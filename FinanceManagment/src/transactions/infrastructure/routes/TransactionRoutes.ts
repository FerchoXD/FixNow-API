import express from 'express';
import { Request, Response } from 'express';
import { createTransactionController, getTransactionController } from '../dependencies';

export const transactionRoutes = express.Router();

transactionRoutes.post('/transactions', (req: Request, res: Response) => {
    createTransactionController.handle(req, res);
})

transactionRoutes.get('/transactions/:id', (req: Request, res: Response) => {
    getTransactionController.handle(req, res);
})