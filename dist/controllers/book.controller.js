import { ZodError } from "zod";
import Book from "../models/Book.js";
import { bookSchema } from "../validators/book.schema.js";
import { formatZodError } from "../utils/errorFormatter.js";
import mongoose from "mongoose";
// utility to format not found error
const notFoundError = (message = "Book not found") => ({
    name: "NotFoundError",
    message,
});
export const createBook = async (req, res) => {
    try {
        const parsedData = bookSchema.parse(req.body);
        const newBook = await Book.create(parsedData);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: newBook,
        });
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: formatZodError(error, req.body),
            });
        }
        res.status(400).json({
            success: false,
            message: "Error creating book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const getBooks = async (req, res) => {
    try {
        // Extract query parameters
        const { filter, sortBy = "createdAt", sort = "desc", limit = "10", } = req.query;
        // Build filter object
        const filterObj = {};
        if (filter && typeof filter === "string") {
            // Validate genre filter
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
        // Build sort object
        const sortObj = {};
        const sortDirection = sort === "asc" ? 1 : -1;
        const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
        sortObj[sortField] = sortDirection;
        // Parse limit
        const limitNum = parseInt(limit) || 10;
        // Execute query with filtering, sorting, and limiting
        const books = await Book.find(filterObj).sort(sortObj).limit(limitNum);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching books",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const getBookById = async (req, res) => {
    try {
        // Validate ObjectId format first
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
                error: notFoundError("Invalid book ID format"),
            });
        }
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
                error: notFoundError(),
            });
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const updateBook = async (req, res) => {
    try {
        // Validate ObjectId format first
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
                error: notFoundError("Invalid book ID format"),
            });
        }
        // Validate the request body
        const parsedData = bookSchema.parse(req.body);
        const updateBook = await Book.findByIdAndUpdate(req.params.id, parsedData, {
            new: true,
        });
        if (!updateBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
                error: notFoundError(),
            });
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updateBook,
        });
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: formatZodError(error, req.body),
            });
        }
        res.status(400).json({
            success: false,
            message: "Error updating book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const deleteBook = async (req, res) => {
    try {
        // Validate ObjectId format first
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
                error: notFoundError("Invalid book ID format"),
            });
        }
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
                error: notFoundError(),
            });
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
