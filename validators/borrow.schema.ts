/**
 * Borrow Validation Schema
 * 
 * Defines Zod validation schema for book borrowing data validation.
 * Ensures all borrow fields meet the required format and business rules.
 * 
 * @author Raiyan Jiyon
 * @version 1.0.0
 */

import zod from "zod";
import mongoose from "mongoose";

/**
 * Borrow validation schema using Zod
 * 
 * Validates borrow transaction data including book ID, quantity, and due date.
 * Includes custom validation for MongoDB ObjectId format and date constraints.
 */
export const BorrowSchema = zod.object({
  // Book ID - must be a valid MongoDB ObjectId
  book: zod.string()
    .min(1, "Book ID is required")
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid book ID format"
    }),
  
  // Quantity - must be at least 1 book
  quantity: zod.number().min(1, "Quantity must be at least 1"),
  
  // Due date - must be a valid future date
  dueDate: zod.string()
    .transform((str) => new Date(str)) // Convert string to Date object
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format"
    })
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),
});
