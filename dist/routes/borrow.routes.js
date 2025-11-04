/**
 * Borrow Routes
 *
 * Defines all HTTP routes for book borrowing operations.
 * Handles borrowing transactions and borrowing history.
 *
 * Base path: /api/borrow
 *
 * @author Raiyan Jiyon
 * @version 1.0.0
 */
import express from "express";
import { createBorrow, getBorrows } from "../controllers/borrow.controller.js";
// Create Express router instance
const router = express.Router();
// POST /api/borrow - Create a new borrow record (borrow a book)
router.post("/", createBorrow);
// GET /api/borrow - Get borrowing summary (all borrowed books)
router.get("/", getBorrows);
export default router;
