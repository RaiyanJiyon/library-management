/**
 * Book Controller
 * 
 * Handles all HTTP requests related to book management.
 * Provides CRUD operations with proper validation and error handling.
 * 
 * @author Raiyan Jiyon
 * @version 1.0.0
 */

import { ZodError } from "zod";
import Book from "../models/Book.js";
import { bookSchema } from "../validators/book.schema.js";
import { Request, Response } from "express";
import { formatZodError } from "../utils/errorFormatter.js";
import mongoose from "mongoose";

/**
 * Utility function to format not found errors
 * Creates a standardized error object for book not found scenarios
 * 
 * @param message - Custom error message (optional)
 * @returns Formatted error object
 */
const notFoundError = (message = "Book not found") => ({
  name: "NotFoundError",
  message,
});

/**
 * Create a new book
 * 
 * Validates the request data and creates a new book in the database.
 * Returns the created book with success status.
 * 
 * @param req - Express request object containing book data
 * @param res - Express response object
 * @returns JSON response with created book or error
 */
export const createBook = async (req: Request, res: Response) => {
  try {
    // Validate request data using Zod schema
    const parsedData = bookSchema.parse(req.body);
    
    // Create new book in database
    const newBook = await Book.create(parsedData);
    
    // Return success response
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error) {
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
      message: "Error creating book",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get all books with optional filtering, sorting, and pagination
 * 
 * Retrieves books from the database with support for:
 * - Genre filtering
 * - Sorting by any field (default: createdAt)
 * - Limiting results (default: 10)
 * 
 * @param req - Express request object with optional query parameters
 * @param res - Express response object
 * @returns JSON response with books array or error
 */
export const getBooks = async (req: Request, res: Response) => {
  try {
    // Extract and set default values for query parameters
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;

    // Build filter object for database query
    const filterObj: Record<string, unknown> = {};
    if (filter && typeof filter === "string") {
      // Validate genre filter against allowed values
      const validGenres = [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ];
      if (validGenres.includes(filter.toUpperCase())) {
        filterObj.genre = filter.toUpperCase();
      }
    }

    // Build sort object for database query
    const sortObj: Record<string, 1 | -1> = {};
    const sortDirection = sort === "asc" ? 1 : -1;
    const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
    sortObj[sortField] = sortDirection;

    // Parse and validate limit parameter
    const limitNum = parseInt(limit as string) || 10;

    // Execute database query with all parameters
    const books = await Book.find(filterObj).sort(sortObj).limit(limitNum);

    // Return success response with books
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    // Handle database or other errors
    res.status(500).json({
      success: false,
      message: "Error fetching books",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get a single book by ID
 * 
 * Retrieves a specific book from the database using its MongoDB ObjectId.
 * Validates the ID format before querying the database.
 * 
 * @param req - Express request object with book ID in params
 * @param res - Express response object
 * @returns JSON response with book data or error
 */
export const getBookById = async (req: Request, res: Response) => {
  try {
    // Validate ObjectId format first
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        error: notFoundError("Invalid book ID format"),
      });
    }

    // Find book by ID in database
    const book = await Book.findById(req.params.id);

    // Check if book exists
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        error: notFoundError(),
      });
    }
    // Return success response with book data
    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching book",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Update an existing book
 * 
 * Updates a book's information in the database after validating both
 * the book ID format and the request data.
 * 
 * @param req - Express request object with book ID in params and update data in body
 * @param res - Express response object
 * @returns JSON response with updated book data or error
 */
export const updateBook = async (req: Request, res: Response) => {
  try {
    // Validate MongoDB ObjectId format before proceeding
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        error: notFoundError("Invalid book ID format"),
      });
    }

    // Validate request body data using Zod schema
    const parsedData = bookSchema.parse(req.body);

    // Update book in database and return updated document
    const updateBook = await Book.findByIdAndUpdate(req.params.id, parsedData, {
      new: true, // Return updated document instead of original
    });
    
    // Check if book was found and updated
    if (!updateBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        error: notFoundError(),
      });
    }
    
    // Return success response with updated book
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updateBook,
    });
  } catch (error) {
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
      message: "Error updating book",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Delete a book
 * 
 * Removes a book from the database permanently.
 * Validates the book ID format and checks if the book exists before deletion.
 * 
 * @param req - Express request object with book ID in params
 * @param res - Express response object
 * @returns JSON response confirming deletion or error
 */
export const deleteBook = async (req: Request, res: Response) => {
  try {
    // Validate MongoDB ObjectId format before proceeding
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        error: notFoundError("Invalid book ID format"),
      });
    }

    // Delete book from database
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    
    // Check if book was found and deleted
    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        error: notFoundError(),
      });
    }
    
    // Return success response (data is null for deletions)
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    // Handle database or other errors
    res.status(500).json({
      success: false,
      message: "Error deleting book",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
