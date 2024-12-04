import { GetAllTotalTransactionsByUser } from "../../application/usecases/GetAllTotalTransactionsByUser";
import { GetTotalTransactionsByUserId } from "../../application/usecases/GetTotalTransactionsByUserId";
import { Request, Response } from "express";

export class GetTotalTransactionsByUserController {
    constructor(private readonly getTotalTransactionsByUser: GetAllTotalTransactionsByUser) { }

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "El ID del usuario es requerido." });
            }
            const totalTransactions = await this.getTotalTransactionsByUser.run(id);
            return res.status(200).json(totalTransactions);
        } catch (error) {
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}
