import mongoose from "mongoose";

export interface IComment {
  content: string;
  post: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
