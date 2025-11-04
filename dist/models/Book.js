import mongoose from "mongoose";
const BookSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
BookSchema.pre('save', function (next) {
    this.available = this.copies > 0;
    next();
});
BookSchema.post('save', function (doc, next) {
    console.log(`Book with ID ${doc._id} has been saved.`);
    next();
});
BookSchema.methods.updateAvailability = async function () {
    if (this.copies === 0) {
        this.available = false;
    }
    else {
        this.available = true;
    }
    await this.save();
};
const Book = mongoose.model("Book", BookSchema);
export default Book;
