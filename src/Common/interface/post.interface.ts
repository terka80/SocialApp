import mongoose from "mongoose";

export interface IPost {
  content: string;
  owner: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
