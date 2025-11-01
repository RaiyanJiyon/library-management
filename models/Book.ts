import mongoose from "mongoose";
import { IBook } from "../interfaces/book.interface.ts";

const BookSchema = new mongoose.Schema<IBook>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        author: {
            type: String,
            required: [true, "Author is required"],
            trim: true,
        },
        genre: {
            type: String,
            required: [true, "Genre is required"],
            enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"], 
        },
        isbn: {
            type: String,
            required: [true, "ISBN is required"],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        copies: {
            type: Number,
            required: [true, "Number of copies is required"],
            min: [0, "Copies cannot be negative"],
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Book = mongoose.model<IBook>("Book", BookSchema);

export default Book;