import { Transaction } from "../entities/Transaction";
import { TotalTransaction } from "../entities/TotalTransaction";

export interface TransactionRepository {
    addTransaction(transaction: Transaction): Promise<Transaction>
    getTransactionById(id: string): Promise<Transaction | null>
    getTransactions(): Promise<Transaction[]>
    findTotalTransaction(userId: string, year: number, month: number): Promise<TotalTransaction | null>
    createTotalTransaction(totalTransaction: TotalTransaction): Promise<TotalTransaction | null>
    updateTotalTransaction(totalTransaction: TotalTransaction): Promise<TotalTransaction>
    getAllTotalTransactionsByUser(id: string): Promise<TotalTransaction[]>;

}