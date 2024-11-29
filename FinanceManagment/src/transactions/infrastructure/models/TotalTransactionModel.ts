import mongoose, { Schema, Document } from 'mongoose';

interface TotalTransaction extends Document {
    _id: string;
    userId: string;
    year: number;
    month: number;
    totalIncome: number;
    totalExpenses: number;
    balance: number;

}

const TotalTransactionSchema = new Schema<TotalTransaction>({
    _id: {type: String, required: true},
    userId: { type: String, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    totalIncome: { type: Number, default: 0 },
    totalExpenses: { type: Number, default: 0 },
    balance: {type: Number, default: 0},
});

export const TotalTransactionModel = mongoose.model<TotalTransaction>('TotalTransactions', TotalTransactionSchema);
