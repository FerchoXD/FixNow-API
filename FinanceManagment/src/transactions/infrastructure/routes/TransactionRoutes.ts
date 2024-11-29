import express from 'express';
import { Request, Response } from 'express';
import { createTransactionController, getTransactionController, getTotalTransactionByUserIdController } from '../dependencies';

export const transactionRoutes = express.Router();

transactionRoutes.post('/transactions', (req: Request, res: Response) => {
    createTransactionController.handle(req, res);
})

transactionRoutes.get('/transactions/:id', (req: Request, res: Response) => {
    getTransactionController.handle(req, res);
})

transactionRoutes.post('/transactions/user', (req: Request, res: Response) => {
    getTotalTransactionByUserIdController.handle(req, res);
})