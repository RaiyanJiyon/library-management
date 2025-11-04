/**
 * Book Routes
 *
 * Defines all HTTP routes for book management operations.
 * Handles CRUD operations for books in the library system.
 *
 * Base path: /api/books
 *
 * @author Raiyan Jiyon
 * @version 1.0.0
 */
import express from 'express';
import { createBook, getBooks, getBookById, updateBook, deleteBook } from '../controllers/book.controller.js';
// Create Express router instance
const router = express.Router();
// POST /api/books - Create a new book
router.post('/', createBook);
// GET /api/books - Get all books (with optional filtering, sorting, pagination)
router.get('/', getBooks);
// GET /api/books/:id - Get a specific book by ID
router.get('/:id', getBookById);
// PUT /api/books/:id - Update an existing book
router.put('/:id', updateBook);
// DELETE /api/books/:id - Delete a book
router.delete('/:id', deleteBook);
export default router;
