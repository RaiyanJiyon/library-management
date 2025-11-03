import mongoose from "mongoose";
const BorrowSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true },
    dueDate: { type: Date, required: true },
}, { timestamps: true, versionKey: false });
const Borrow = mongoose.model("Borrow", BorrowSchema);
export default Borrow;
