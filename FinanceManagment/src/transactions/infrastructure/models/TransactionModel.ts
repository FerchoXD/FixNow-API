import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
    _id: string;
    type: 'income' | 'expense';
    amount: number;
    date: Date;
    category: string;
    userId: string;
    description: string;
    state: 'progress' | 'completed' | 'canceled';
}

const TransactionSchema = new Schema<ITransaction>({
    _id: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    userId: { type: String, required: true },
    description: { type: String, required: true },
    state: { type: String, enum: ['progress', 'completed', 'canceled'], required: true }
});

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);
