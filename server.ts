/**
 * Library Management System - Main Server File
 * 
 * This is the entry point for the Library Management API.
 * It sets up the Express server, connects to MongoDB, and configures routes.
 * 
 * @author Raiyan Jiyon
 * @version 1.0.0
 */

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bookRoutes from './routes/book.routes.js';
import borrowRoutes from './routes/borrow.routes.js';
import cors from "cors";
// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Allow requests from your React dev server
app.use(cors({
  origin: ['http://localhost:5173']
}));

// Server configuration
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Validate required environment variables
if (!MONGO_URI) {
  console.error("MONGO_URI environment variable is required");
  process.exit(1);
}

// Middleware configuration
app.use(express.json()); // Parse JSON request bodies

// Database connection and server startup
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server only after successful database connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Route definitions

/**
 * Health check endpoint
 * Returns a simple message to verify the API is running
 */
app.get('/', (req, res) => {
  res.send('Library Management API is running');
})

/**
 * Book management routes
 * Handles CRUD operations for books
 * Base path: /api/books
 */
app.use('/api/books', bookRoutes);

/**
 * Borrow management routes
 * Handles borrowing and returning books
 * Base path: /api/borrow
 */
app.use('/api/borrow', borrowRoutes)

// Export the app for testing purposes
export default app;
