/**
 * Borrow Interface
 * 
 * Defines the TypeScript interface for borrow transaction objects.
 * Used for type checking borrowing operations and database interactions.
 * 
 * @author Raiyan Jiyon
 * @version 1.0.0
 */

import mongoose from "mongoose";

/**
 * Interface for Borrow document structure
 * 
 * Defines the shape of borrow transaction objects in the database.
 * Tracks book borrowing information including references and timestamps.
 */
export interface IBorrow {
  /** Reference to the borrowed book (MongoDB ObjectId) */
  book: mongoose.Types.ObjectId;
  
  /** Number of copies borrowed */
  quantity: number;
  
  /** Date when the book should be returned */
  dueDate: Date;
  
  /** Timestamp when the borrow record was created (auto-generated) */
  createdAt?: Date;
  
  /** Timestamp when the borrow record was last updated (auto-generated) */
  updatedAt?: Date;
}
