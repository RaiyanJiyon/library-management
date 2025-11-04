/**
 * Borrow Controller
 * 
 * Handles all HTTP requests related to book borrowing operations.
 * Manages borrowing transactions with proper validation and database consistency.
 * 
 * @author Raiyan Jiyon
 * @version 1.0.0
 */

import Borrow from "../models/Borrow.js";
import { Request, Response } from "express";
import { BorrowSchema } from "../validators/borrow.schema.js";
import { ZodError } from "zod";
import { formatZodError } from "../utils/errorFormatter.js";
import Book from "../models/Book.js";

/**
 * Create a new borrow record
 * 
 * Processes a book borrowing request with database transaction to ensure consistency.
 * Updates book inventory and creates a borrow record atomically.
 * 
 * @param req - Express request object containing borrow details
 * @param res - Express response object
 * @returns JSON response with borrow record or error
 */
export const createBorrow = async (req: Request, res: Response) => {
  // Start database session for transaction
  const session = await Book.startSession();
  session.startTransaction();

  try {
    // Validate request data using Zod schema
    const parsedData = BorrowSchema.parse(req.body);
    const { book: bookId, quantity, dueDate } = parsedData;

    // Find the book within the transaction session
    const book = await Book.findById(bookId).session(session);

    // Check if book exists
    if (!book) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if requested quantity is available
    if (!book.available || book.copies < quantity) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Requested quantity not available",
      });
    }

    // Update book inventory (reduce available copies)
    book.copies -= quantity;

    // Save the updated book (availability will be updated by pre-save middleware)
    await book.save({ session });

    // Create borrow record within the transaction
    const borrow = await Borrow.create(
      [
        {
          book: bookId,
          quantity,
          dueDate,
        },
      ],
      { session }
    );

    // Commit transaction if all operations succeed
    await session.commitTransaction();
    await session.endSession();

    // Return success response with borrow record
    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow[0],
    });
  } catch (error) {
    // Always cleanup session on error to prevent memory leaks
    await session.abortTransaction();
    await session.endSession();
    
    // Handle validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: formatZodError(error, req.body),
      });
    }
    
    // Handle other errors
    res.status(400).json({
      success: false,
      message: "Error creating borrow record",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get borrowing summary
 * 
 * Retrieves a summary of all borrowed books using MongoDB aggregation.
 * Groups borrows by book and calculates total quantities borrowed.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with borrowing summary or error
 */
export const getBorrows = async (req: Request, res: Response) => {
  try {
    // Aggregate borrow records to get summary by book
    const borrows = await Borrow.aggregate([
      {
        // Group by book ID and sum quantities
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        // Join with books collection to get book details
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        // Flatten the bookDetails array
        $unwind: "$bookDetails",
      },
      {
        // Project only required fields for response
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    // Return success response with borrowing summary
    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: borrows,
    });
    
  } catch (error) {
    // Handle database or aggregation errors
    res.status(500).json({
      success: false,
      message: "Error fetching borrow records",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
