# 📖 Library Management System API

A comprehensive **Library Management System** built with **Express.js**, **TypeScript**, and **MongoDB** using **Mongoose**. This RESTful API provides complete functionality for managing books and borrowing operations with robust validation, error handling, and business logic enforcement.

## 🚀 Features

### 📚 Book Management
- **Create Books**: Add new books with comprehensive validation
- **View Books**: Retrieve all books with filtering, sorting, and pagination
- **Get Book Details**: Fetch individual book information by ID
- **Update Books**: Modify book information and availability
- **Delete Books**: Remove books from the library system

### 📋 Borrowing System
- **Borrow Books**: Borrow books with automatic availability management
- **Borrowed Books Summary**: View aggregated borrowing statistics using MongoDB aggregation pipeline
- **Business Logic**: Automatic copy management and availability updates

### 🔧 Technical Features
- **TypeScript**: Full type safety and modern JavaScript features
- **Schema Validation**: Comprehensive input validation using Zod
- **Error Handling**: Structured error responses with detailed validation messages
- **MongoDB Aggregation**: Advanced data aggregation for borrowing statistics
- **Mongoose Middleware**: Custom instance methods for business logic
- **Transaction Support**: Database transactions for data consistency
- **RESTful API**: Following REST principles and conventions

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Validation**: Zod
- **Environment**: dotenv

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/RaiyanJiyon/library-management
cd library-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/library
```

For MongoDB Atlas:
```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/library?retryWrites=true&w=majority
```

### 4. Start the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### 📚 Book Endpoints

#### 1. Create Book
**POST** `/api/books`

**Request Body:**
```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

#### 2. Get All Books
**GET** `/api/books`

**Query Parameters:**
- `filter`: Filter by genre (FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY)
- `sortBy`: Sort field (default: createdAt)
- `sort`: Sort direction (asc/desc, default: desc)
- `limit`: Number of results (default: 10)

**Example:**
```
GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5
```

#### 3. Get Book by ID
**GET** `/api/books/:bookId`

#### 4. Update Book
**PUT** `/api/books/:bookId`

**Request Body:**
```json
{
  "copies": 50
}
```

#### 5. Delete Book
**DELETE** `/api/books/:bookId`

### 📋 Borrowing Endpoints

#### 1. Borrow a Book
**POST** `/api/borrow`

**Request Body:**
```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
  }
}
```

#### 2. Borrowed Books Summary
**GET** `/api/borrow`

**Response:**
```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

## 📊 Data Models

### Book Model
```typescript
{
  title: string;        // Required
  author: string;       // Required
  genre: string;        // Required (FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY)
  isbn: string;         // Required, Unique
  description?: string; // Optional
  copies: number;       // Required, Non-negative
  available: boolean;   // Default: true
}
```

### Borrow Model
```typescript
{
  book: ObjectId;       // Required, References Book
  quantity: number;     // Required, Positive integer
  dueDate: Date;        // Required, Future date
}
```

## 🔒 Validation Rules

### Book Validation
- **Title**: Required, non-empty string
- **Author**: Required, non-empty string
- **Genre**: Must be one of the predefined genres
- **ISBN**: Required, unique, non-empty string
- **Copies**: Required, non-negative number
- **Available**: Boolean, defaults to true

### Borrow Validation
- **Book**: Required, valid MongoDB ObjectId
- **Quantity**: Required, positive integer
- **Due Date**: Required, must be a future date

## 🚨 Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```

## 🏗️ Project Structure

```
library-management/
├── controllers/
│   ├── book.controller.ts
│   └── borrow.controller.ts
├── interfaces/
│   ├── book.interface.ts
│   └── borrow.interface.ts
├── models/
│   ├── Book.ts
│   └── Borrow.ts
├── routes/
│   ├── book.routes.ts
│   └── borrow.routes.ts
├── utils/
│   └── errorFormatter.ts
├── validators/
│   ├── book.schema.ts
│   └── borrow.schema.ts
├── server.ts
├── package.json
└── README.md
```

## 🧪 Testing the API

### Using cURL

#### Create a Book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "genre": "FICTION",
    "isbn": "9780451524935",
    "description": "A dystopian social science fiction novel",
    "copies": 10
  }'
```

#### Get All Books
```bash
curl http://localhost:3000/api/books
```

#### Borrow a Book
```bash
curl -X POST http://localhost:3000/api/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "book": "BOOK_ID_HERE",
    "quantity": 1,
    "dueDate": "2025-12-31T00:00:00.000Z"
  }'
```

### Using Postman
1. Import the API endpoints into Postman
2. Set the base URL to `http://localhost:3000/api`
3. Use the provided request examples above

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

### Build for Production
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Raiyan Jiyon**

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- MongoDB team for the powerful database
- TypeScript team for type safety
- Zod team for schema validation

---

**Happy Coding! 🚀**
