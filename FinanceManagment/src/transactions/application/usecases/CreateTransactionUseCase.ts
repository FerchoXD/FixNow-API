import { TotalTransaction } from "../../domain/entities/TotalTransaction";
import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class CreateTransactionUseCase {
    constructor(readonly repository: TransactionRepository) { }

    async run(type: 'income' | 'expense', userId: string, amount: number, date: Date, category: string, description: string, state: 'progress' | 'completed' | 'canceled') {
        try {
            const transaction = new Transaction(
                type,
                userId,
                amount,
                date,
                category,
                description,
                state
            );

            const newDate = new Date(date);
            const newTransaction = await this.repository.addTransaction(transaction);
            const year = newDate.getFullYear();
            const month = newDate.getMonth() + 1;
            const totalTransaction = await this.repository.findTotalTransaction(userId, year, month);
            if (totalTransaction) {
                if (type === 'income') {
                    totalTransaction.addIncome(amount)
                } else {
                    totalTransaction.addExpense(amount);
                }
                await this.repository.updateTotalTransaction(totalTransaction);
            } else {
                const newTotalTransaction = new TotalTransaction(userId, year, month);
                if (type === 'income') {
                    newTotalTransaction.addIncome(amount);
                } else {
                    newTotalTransaction.addExpense(amount);
                }
                await this.repository.createTotalTransaction(newTotalTransaction);
            }

            return newTransaction;
        } catch (error) {
            return error;
        }
    }
}