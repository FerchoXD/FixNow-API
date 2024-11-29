import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class GetTransactionUseCase {
    constructor(readonly repository: TransactionRepository) { }
    async run(id: string) {
        console.log(id)
        try {
            const transaction = await this.repository.getTransactionById(id);
            if (!transaction) {
                throw new Error('Transacción no encontrada')
            }
            return transaction;
        } catch (error) {
            return error;
        }
    }
}