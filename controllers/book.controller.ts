import Book from '../models/Book.ts';
import { bookSchema } from '../validators/book.schema.ts';
import { Request, Response } from 'express';

export const createBook = async (req: Request, res: Response) => {
    try {
        const parsedData = bookSchema.parse(req.body);
        const newBook = await Book.create(parsedData)
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: 'Error creating book', error });
    }
};

export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error });
    }
};

export const updateBook = async (req: Request, res: Response) => {
    try {
        const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updateBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(updateBook);
    } catch (error) {
        res.status(400).json({ message: 'Error updating book', error });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
}