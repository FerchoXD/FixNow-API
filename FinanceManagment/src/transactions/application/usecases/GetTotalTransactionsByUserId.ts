import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class GetTotalTransactionsByUserId {
    constructor(readonly repository: TransactionRepository) { }

    async run(userId: string, year: number, month: number) {
        try {
            const totalTransactions = await this.repository.findTotalTransaction(userId, year, month);
            if (!totalTransactions) {
                throw new Error('Transacción no encontrada')
            }
            return totalTransactions;
        } catch (error) {

        }
    }
}