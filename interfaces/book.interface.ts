/**
 * Book Interface
 * 
 * Defines the TypeScript interface for book objects.
 * Used for type checking and ensuring data consistency across the application.
 * 
 * @author Raiyan Jiyon
 * @version 1.0.0
 */

/**
 * Interface for Book document structure
 * 
 * Defines the shape of book objects in the database and application.
 * Includes all book properties and instance methods.
 */
export interface IBook {
  /** Book title */
  title: string;
  
  /** Book author */
  author: string;
  
  /** Book genre - must be one of predefined categories */
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  
  /** ISBN - unique identifier for the book */
  isbn: string;
  
  /** Optional book description */
  description?: string;
  
  /** Number of copies available in the library */
  copies: number;
  
  /** Availability status - automatically calculated */
  available?: boolean;
  
  /** Instance method to update book availability status */
  updateAvailability: () => Promise<void>;
}
