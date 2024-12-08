import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from "uuid";

export interface IChatBot extends Document {
  uuid: string;
  userUuid: string;
  content?: string;
  suppliers?: any;
  complexity?: string;
  simpleResponse?: string;
  complexityResponse?: string;
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
    content: {
      type: String,
      required: true,
    },
    suppliers: {
      type: Array,
      required: false,
    },
    complexity: {
      type: String,
      required: false,
    },
    simpleResponse: {
      type: String,
      required: false,
    },
    complexityResponse: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatbotModel = model<IChatBot>('Chatbot', chatBotSchema);
