import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bookRoutes from './routes/book.routes.js';
import borrowRoutes from './routes/borrow.routes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/library";
app.use(express.json());
mongoose
    .connect(MONGO_URI)
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});
// Define routes here
// Book routes
app.use('/api/books', bookRoutes);
// Borrow routes
app.use('/api/borrow', borrowRoutes);
export default app;
