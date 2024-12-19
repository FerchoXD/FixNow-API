import { GetTotalTransactionsByUserId } from "../../application/usecases/GetTotalTransactionsByUserId";
import { Request, Response } from "express";
export class GetTotalTransactionsByUserIdController {
    constructor(readonly getTotalTransactionByUserId: GetTotalTransactionsByUserId) { }

    async handle(req: Request, res: Response) {
        const { userId, year, month } = req.body;
        try {
            const totalTransactions = await this.getTotalTransactionByUserId.run(userId, year, month);
            if (!totalTransactions) return res.status(404).json({ message: "Transacciones no encontradas" });
            return res.status(200).json(totalTransactions);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener las transacciones' });
        }

    }
}