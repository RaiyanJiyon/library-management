import mongoose from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface.js";

const BorrowSchema = new mongoose.Schema<IBorrow>(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

const Borrow = mongoose.model<IBorrow>("Borrow", BorrowSchema);

export default Borrow;
