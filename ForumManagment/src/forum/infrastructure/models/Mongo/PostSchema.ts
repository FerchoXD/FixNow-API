import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from "uuid";

export interface IPost extends Document {
  uuid: string;
  username: string;
  title: string;
  content: string;
  time: Date;
  createdAt?: Date; 
  updatedAt?: Date;
}

const postSchema = new Schema<IPost>(
  {
    uuid: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
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

export const PostModel = model<IPost>('Post', postSchema);
