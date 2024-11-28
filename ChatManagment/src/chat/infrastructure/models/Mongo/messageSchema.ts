import { Schema, model, Document } from 'mongoose';

interface IMessage extends Document {
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = model<IMessage>('Message', messageSchema);

export default Message;
