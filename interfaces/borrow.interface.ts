import mongoose from "mongoose";

export interface IBorrow {
  book: mongoose.Types.ObjectId;
  quantity: number;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
