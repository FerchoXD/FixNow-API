import { GetTransactionUseCase } from "../../application/usecases/GetTransactionUseCase";
import { Request, Response } from 'express';


export class GetTransactionController {
    constructor(readonly getTransaction: GetTransactionUseCase) { }

    async handle(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const transaction = await this.getTransaction.run(id);
            if (!transaction) return res.status(404).json({ message: "Transacción no encontrada" });
            return res.status(200).json(transaction);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener la transacción' });
        }
    }
}