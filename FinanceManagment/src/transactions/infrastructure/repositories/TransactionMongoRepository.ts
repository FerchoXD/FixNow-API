import { TotalTransaction } from "../../domain/entities/TotalTransaction";
import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";
import { TotalTransactionModel } from "../models/TotalTransactionModel";
import { TransactionModel } from "../models/TransactionModel";

export class TransactionMongoRepository implements TransactionRepository {
    async addTransaction(transaction: Transaction): Promise<Transaction> {
        const transactionDoc = new TransactionModel(transaction);
        await transactionDoc.save();
        return transaction;
    }

    async getTransactionById(id: string): Promise<Transaction | null> {
        return await TransactionModel.findById(id).lean();
    }


    async getTransactions(): Promise<Transaction[]> {
        const transactions = await TransactionModel.find().lean();
        return transactions as Transaction[];
    }

    async createTotalTransaction(totalTransaction: TotalTransaction): Promise<TotalTransaction | null> {
        const totalTransactionDoc = new TotalTransactionModel(totalTransaction);
        await totalTransactionDoc.save();
        return totalTransaction;
    }

    async findTotalTransaction(userId: string, year: number, month: number): Promise<TotalTransaction | null> {
        const totalTransactionDoc = await TotalTransactionModel.findOne({ userId, year, month }).lean();
        if (!totalTransactionDoc) return null;
        return new TotalTransaction(
            totalTransactionDoc.userId,
            totalTransactionDoc.year,
            totalTransactionDoc.month,
            totalTransactionDoc.totalIncome,
            totalTransactionDoc.totalExpenses,
            totalTransactionDoc.balance,
        );
    }

    async updateTotalTransaction(totalTransaction: TotalTransaction): Promise<TotalTransaction> {
        const updatedTotalTransactionDoc = await TotalTransactionModel.findOneAndUpdate(
            { userId: totalTransaction.userId, year: totalTransaction.year, month: totalTransaction.month },
            { $set: { totalIncome: totalTransaction.totalIncome, totalExpenses: totalTransaction.totalExpenses, balance: totalTransaction.balance } },
            { new: true }
        ).lean();

        if (!updatedTotalTransactionDoc) throw new Error("Transaccion total no encontrada para actualizar");

        return new TotalTransaction(
            updatedTotalTransactionDoc.userId,
            updatedTotalTransactionDoc.year,
            updatedTotalTransactionDoc.month,
            updatedTotalTransactionDoc.totalIncome,
            updatedTotalTransactionDoc.totalExpenses,
            updatedTotalTransactionDoc.balance,
        );
    }

}