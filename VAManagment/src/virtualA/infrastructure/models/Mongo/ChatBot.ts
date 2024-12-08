import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from "uuid";

export interface IChatBot extends Document {
  uuid: string;
  userUuid: string;
  username: string;
  title: string;
  content: string;
  time: Date;
  createdAt?: Date; 
  updatedAt?: Date;
}

const chatBotSchema = new Schema<IChatBot>(
  {
    uuid: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    userUuid: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatbotModel = model<IChatBot>('Chatbot', chatBotSchema);
