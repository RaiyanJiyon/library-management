/**
 * Book Model
 *
 * Defines the MongoDB schema and model for books in the library system.
 * Includes validation rules, middleware hooks, and instance methods.
 *
 * @author Raiyan Jiyon
 * @version 1.0.0
 */
import mongoose from "mongoose";
/**
 * Book Schema Definition
 * Defines the structure and validation rules for book documents
 */
const BookSchema = new mongoose.Schema({
    // Book title - required field with trimming
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    // Book author - required field with trimming
    author: {
        type: String,
        required: [true, "Author is required"],
        trim: true,
    },
    // Book genre - must be one of predefined values
    genre: {
        type: String,
        required: [true, "Genre is required"],
        enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
    },
    // ISBN - unique identifier for books
    isbn: {
        type: String,
        required: [true, "ISBN is required"],
        unique: true,
        trim: true,
    },
    // Optional book description
    description: {
        type: String,
        trim: true,
    },
    // Number of copies available in the library
    copies: {
        type: Number,
        required: [true, "Number of copies is required"],
        min: [0, "Copies cannot be negative"],
    },
    // Availability status - automatically calculated
    available: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt
    versionKey: false, // Disable __v field
});
/**
 * Pre-save middleware
 * Automatically updates the availability status based on the number of copies
 */
BookSchema.pre('save', function (next) {
    this.available = this.copies > 0;
    next();
});
/**
 * Post-save middleware
 * Logs when a book is saved (only in development environment)
 */
BookSchema.post('save', function (doc, next) {
    // Only log in development environment
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Book with ID ${doc._id} has been saved.`);
    }
    next();
});
/**
 * Instance method to update book availability
 * Updates the availability status based on current copies count
 *
 * @returns Promise<void>
 */
BookSchema.methods.updateAvailability = async function () {
    if (this.copies === 0) {
        this.available = false;
    }
    else {
        this.available = true;
    }
    await this.save();
};
// Create and export the Book model
const Book = mongoose.model("Book", BookSchema);
export default Book;
