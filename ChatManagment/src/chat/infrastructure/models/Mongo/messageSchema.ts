import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
    sender: string;
    receiver: string;
    message: string;
    timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const MessageModel = model<IMessage>('Message', messageSchema);
