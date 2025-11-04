/**
 * Book Validation Schema
 *
 * Defines Zod validation schema for book data validation.
 * Ensures all book fields meet the required format and constraints.
 *
 * @author Raiyan Jiyon
 * @version 1.0.0
 */
import zod from "zod";
/**
 * Book validation schema using Zod
 *
 * Validates book data for create and update operations.
 * Includes validation for all required fields and data types.
 */
export const bookSchema = zod.object({
    // Book title - required, non-empty string
    title: zod.string().min(1, "Title is required"),
    // Book author - required, non-empty string
    author: zod.string().min(1, "Author is required"),
    // Book genre - must be one of predefined enum values
    genre: zod.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"], {
        error: "Genre is required and must be a valid option",
    }),
    // ISBN - required, non-empty string (unique constraint handled by database)
    isbn: zod.string().min(1, "ISBN is required"),
    // Description - optional string field
    description: zod.string().optional(),
    // Number of copies - required number, cannot be negative
    copies: zod
        .number()
        .min(0, "Number of copies is required and cannot be negative"),
    // Availability status - optional boolean (auto-calculated by model)
    available: zod.boolean().optional(),
});
