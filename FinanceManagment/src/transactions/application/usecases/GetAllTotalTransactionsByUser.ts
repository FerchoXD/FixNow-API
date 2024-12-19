import { TransactionRepository } from "../../domain/repositories/TransactionRepository";
import { TotalTransaction } from "../../domain/entities/TotalTransaction";

export class GetAllTotalTransactionsByUser {
    constructor(private readonly repository: TransactionRepository) { }

    async run(userId: string): Promise<TotalTransaction[]> {
        if (!userId) {
            throw new Error("El ID del usuario es requerido.");
        }
        const totalTransactions = await this.repository.getAllTotalTransactionsByUser(userId);

        if (!totalTransactions || totalTransactions.length === 0) {
            throw new Error("No se encontraron transacciones totales para el usuario.");
        }

        return totalTransactions;
    }
}
