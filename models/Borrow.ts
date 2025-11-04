/**
 * Borrow Model
 * 
 * Defines the MongoDB schema and model for book borrowing records.
 * Tracks which books are borrowed, quantities, and due dates.
 * 
 * @author Raiyan Jiyon
 * @version 1.0.0
 */

import mongoose from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface.js";

/**
 * Borrow Schema Definition
 * Defines the structure for book borrowing transactions
 */
const BorrowSchema = new mongoose.Schema<IBorrow>(
  {
    // Reference to the borrowed book
    book: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Book", 
      required: true 
    },
    // Number of copies borrowed
    quantity: { 
      type: Number, 
      required: true 
    },
    // Date when the book should be returned
    dueDate: { 
      type: Date, 
      required: true 
    },
  },
  { 
    timestamps: true, // Automatically add createdAt and updatedAt
    versionKey: false // Disable __v field
  }
);

// Create and export the Borrow model
const Borrow = mongoose.model<IBorrow>("Borrow", BorrowSchema);

export default Borrow;
