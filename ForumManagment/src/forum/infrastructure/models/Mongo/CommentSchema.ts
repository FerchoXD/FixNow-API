import { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
  uuid: string;
  postUuid: string; 
  username: string;
  content: string;
  time: Date;
}

const commentSchema = new Schema<IComment>({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  postUuid: {
    type: String,
    required: true,
    ref: 'Post', // Referencia al modelo Post
  },
  username: {
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
});

export const CommentModel = model<IComment>('Comment', commentSchema);
