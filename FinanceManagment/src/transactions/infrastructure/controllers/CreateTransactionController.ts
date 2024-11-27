import { CreateTransactionUseCase } from "../../application/usecases/CreateTransactionUseCase";
import { Request, Response } from 'express';


export class CreateTransactionController {
    constructor(readonly createTransactionUseCase: CreateTransactionUseCase) { }

    async handle(req: Request, res: Response) {
        try {
            const { type, userId, amount, date, category, description, state } = req.body;
            if (!type || !amount || !date || !category || !userId  || !description || !state) return res.status(400).json({ error: "Bad Request", message: "Faltan campos obligatorios" })
            const transaction = await this.createTransactionUseCase.run(type, userId, amount, date, category, description, state);
            console.log(transaction)
            return res.status(201).json(transaction);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al agregar la transacción' });
        }
    }
}