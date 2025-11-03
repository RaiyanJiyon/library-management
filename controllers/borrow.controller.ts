import Borrow from "../models/Borrow";
import { Request, Response } from "express";
import { BorrowSchema } from "../validators/borrow.schema";
import { ZodError } from "zod";
import { formatZodError } from "../utils/errorFormatter";
import Book from "../models/Book";

export const createBorrow = async (req: Request, res: Response) => {
  const session = await Book.startSession();
  session.startTransaction();

  try {
    const parsedData = BorrowSchema.parse(req.body);
    const { book: bookId, quantity, dueDate } = parsedData;

    const book = await Book.findById(bookId).session(session);

    if (!book) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (!book.available || book.copies < quantity) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Requested quantity not available",
      });
    }

    book.copies -= quantity;

    await book.updateAvailability(quantity);

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

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow[0],
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: formatZodError(error, req.body),
      });
    }
    res.status(400).json({
      success: false,
      message: "Error creating borrow record",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getBorrows = async (req: Request, res: Response) => {
  try {
    const borrows = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
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

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: borrows,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching borrow records",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
