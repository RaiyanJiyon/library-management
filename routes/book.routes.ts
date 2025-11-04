import express from 'express';
import {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook       
} from '../controllers/book.controller.js';

const router = express.Router();

router.post('/', createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;