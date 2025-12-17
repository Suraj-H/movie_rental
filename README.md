# 🎬 Movie Rental API

A robust, production-ready RESTful API for managing a movie rental system. Built with Express.js 5, MongoDB, and JWT authentication, featuring comprehensive validation, error handling, and security best practices.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Security Features](#-security-features)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Postman Collection](#-postman-collection)
- [Development](#-development)
- [License](#-license)

## ✨ Features

### Core Functionality
- **User Management**: User registration, authentication, and profile management
- **Genre Management**: CRUD operations for movie genres with role-based access control
- **Customer Management**: Complete customer lifecycle management
- **Movie Management**: Movie catalog with genre association and stock tracking
- **Rental System**: Transaction-based movie rentals with automatic stock management
- **Return Processing**: Automated rental returns with fee calculation

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and regular user roles
- **Input Validation**: Comprehensive request validation using Joi
- **Error Handling**: Centralized error handling with Winston logging
- **Database Transactions**: ACID-compliant rental operations
- **Security Headers**: Helmet.js for security best practices
- **Response Compression**: Gzip compression for optimized responses
- **Structured Logging**: Winston-based logging system

## 🛠 Tech Stack

### Backend Framework
- **Express.js 5.1.0**: Modern web framework with native async/await error handling
- **Node.js**: >=18.0.0

### Database
- **MongoDB**: NoSQL database with Mongoose ODM
- **Mongoose 9.0.1**: MongoDB object modeling

### Authentication & Security
- **JSON Web Token (JWT)**: Token-based authentication
- **bcrypt 6.0.0**: Password hashing
- **Helmet.js**: Security headers middleware
- **Joi**: Input validation and sanitization

### Utilities
- **Winston**: Structured logging
- **Lodash**: Utility functions
- **Compression**: Response compression middleware
- **Config**: Environment-based configuration management
- **dotenv**: Environment variable management

### Development Tools
- **Nodemon**: Development server with auto-reload
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movie_rental
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp sample.env .env
```

Edit `.env` with your configuration:

```env
jwtPrivateKey=your-super-secret-jwt-key-here
db=mongodb://localhost/movie-rental
PORT=3000
```

**Important**:
- Use a strong, random string for `jwtPrivateKey` (minimum 32 characters recommended)
- Update `db` connection string if using MongoDB Atlas or remote MongoDB instance

### 4. Start MongoDB

**Local MongoDB:**
```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**MongoDB Atlas:**
- Use your Atlas connection string in the `.env` file

### 5. Run the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `jwtPrivateKey` | Secret key for JWT token signing | Yes | - |
| `db` | MongoDB connection string | Yes | `mongodb://localhost/movie-rental` |
| `PORT` | Server port | No | `3000` |

### Configuration Files

The project uses the `config` package for environment-based configuration:

- `config/default.json`: Default configuration
- `config/custom-environment-variables.json`: Maps environment variables
- `config/test.json`: Test environment configuration

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

Most endpoints require authentication via JWT token. Include the token in the request header:

```
x-auth-token: <your-jwt-token>
```

Tokens are obtained through:
- User registration (`POST /api/users`) - Returns token in response header
- User login (`POST /api/auth`) - Returns token in response body

---

## 🔐 Authentication Endpoints

### `POST /api/auth`
**Login and receive JWT token**

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```
<JWT_TOKEN_STRING>
```

**Features:**
- Validates email format (5-255 characters)
- Validates password (5-255 characters)
- Returns JWT token on successful authentication
- Token automatically saved in Postman collection variable

---

## 👥 User Management Endpoints

### `POST /api/users`
**Register a new user**

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Headers:**
- `x-auth-token`: JWT token (automatically set)

**Validation:**
- Name: 5-50 characters
- Email: Valid email format, 5-255 characters
- Password: 5-255 characters (hashed with bcrypt)

---

### `GET /api/users/me`
**Get current authenticated user**

**Authentication:** Required (`x-auth-token` header)

**Response:** `200 OK`
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false
}
```

**Note:** Password is excluded from response

---

## 🎭 Genre Management Endpoints

### `GET /api/genres`
**Get all genres**

**Authentication:** Not required

**Response:** `200 OK`
```json
[
  {
    "_id": "genre_id",
    "name": "Action"
  },
  {
    "_id": "genre_id_2",
    "name": "Comedy"
  }
]
```

**Sorting:** Results sorted by name (ascending)

---

### `GET /api/genres/:id`
**Get genre by ID**

**Authentication:** Not required

**Parameters:**
- `id`: Genre MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "_id": "genre_id",
  "name": "Action"
}
```

**Error:** `404 Not Found` - Genre not found or invalid ID

---

### `POST /api/genres`
**Create a new genre**

**Authentication:** Required (`x-auth-token` header)

**Request Body:**
```json
{
  "name": "Action"
}
```

**Response:** `200 OK`
```json
{
  "_id": "genre_id",
  "name": "Action"
}
```

**Validation:**
- Name: 5-50 characters, required

**Auto-saves:** `genreId` to collection variables

---

### `PUT /api/genres/:id`
**Update a genre**

**Authentication:** Required (`x-auth-token` header)

**Parameters:**
- `id`: Genre MongoDB ObjectId

**Request Body:**
```json
{
  "name": "Sci-Fi"
}
```

**Response:** `200 OK`
```json
{
  "_id": "genre_id",
  "name": "Sci-Fi"
}
```

**Validation:**
- Name: 5-50 characters, required
- ID validated for ObjectId format

---

### `DELETE /api/genres/:id`
**Delete a genre**

**Authentication:** Required (`x-auth-token` header) + **Admin role**

**Parameters:**
- `id`: Genre MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "_id": "genre_id",
  "name": "Action"
}
```

**Error:** `403 Forbidden` - User is not admin

---

## 👤 Customer Management Endpoints

### `GET /api/customers`
**Get all customers**

**Authentication:** Not required

**Response:** `200 OK`
```json
[
  {
    "_id": "customer_id",
    "name": "John Doe",
    "phone": "1234567890",
    "isGold": false
  }
]
```

**Sorting:** Results sorted by name (ascending)

---

### `GET /api/customers/:id`
**Get customer by ID**

**Authentication:** Not required

**Parameters:**
- `id`: Customer MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "_id": "customer_id",
  "name": "John Doe",
  "phone": "1234567890",
  "isGold": false
}
```

**Error:** `404 Not Found` - Customer not found

---

### `POST /api/customers`
**Create a new customer**

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "isGold": false
}
```

**Response:** `200 OK`
```json
{
  "_id": "customer_id",
  "name": "John Doe",
  "phone": "1234567890",
  "isGold": false
}
```

**Validation:**
- Name: 5-50 characters, required
- Phone: 5-50 characters, required
- isGold: Boolean (optional, defaults to `false`)

**Auto-saves:** `customerId` to collection variables

---

### `PUT /api/customers/:id`
**Update a customer**

**Authentication:** Not required

**Parameters:**
- `id`: Customer MongoDB ObjectId

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phone": "9876543210",
  "isGold": true
}
```

**Response:** `200 OK`
```json
{
  "_id": "customer_id",
  "name": "Jane Doe",
  "phone": "9876543210",
  "isGold": true
}
```

**Error:** `404 Not Found` - Customer not found

---

### `DELETE /api/customers/:id`
**Delete a customer**

**Authentication:** Not required

**Parameters:**
- `id`: Customer MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "_id": "customer_id",
  "name": "John Doe",
  "phone": "1234567890",
  "isGold": false
}
```

**Error:** `404 Not Found` - Customer not found

---

## 🎬 Movie Management Endpoints

### `GET /api/movies`
**Get all movies**

**Authentication:** Not required

**Response:** `200 OK`
```json
[
  {
    "_id": "movie_id",
    "title": "The Matrix",
    "genre": {
      "_id": "genre_id",
      "name": "Action"
    },
    "numberInStock": 10,
    "dailyRentalRate": 2.5
  }
]
```

**Sorting:** Results sorted by title (ascending)

---

### `GET /api/movies/:id`
**Get movie by ID**

**Authentication:** Not required

**Parameters:**
- `id`: Movie MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "_id": "movie_id",
  "title": "The Matrix",
  "genre": {
    "_id": "genre_id",
    "name": "Action"
  },
  "numberInStock": 10,
  "dailyRentalRate": 2.5
}
```

**Error:** `404 Not Found` - Movie not found

---

### `POST /api/movies`
**Create a new movie**

**Authentication:** Not required

**Request Body:**
```json
{
  "title": "The Matrix",
  "genreId": "genre_id_here",
  "numberInStock": 10,
  "dailyRentalRate": 2.5
}
```

**Response:** `200 OK`
```json
{
  "_id": "movie_id",
  "title": "The Matrix",
  "genre": {
    "_id": "genre_id",
    "name": "Action"
  },
  "numberInStock": 10,
  "dailyRentalRate": 2.5
}
```

**Validation:**
- Title: 5-50 characters, required
- genreId: Valid MongoDB ObjectId, required (validates genre exists)
- numberInStock: Number >= 0, required
- dailyRentalRate: Number >= 0, required

**Error:** `400 Bad Request` - Invalid genre ID

**Auto-saves:** `movieId` to collection variables

---

### `PUT /api/movies/:id`
**Update a movie**

**Authentication:** Not required

**Parameters:**
- `id`: Movie MongoDB ObjectId

**Request Body:**
```json
{
  "title": "The Matrix Reloaded",
  "genreId": "genre_id_here",
  "numberInStock": 8,
  "dailyRentalRate": 3.0
}
```

**Response:** `200 OK`
```json
{
  "_id": "movie_id",
  "title": "The Matrix Reloaded",
  "genre": {
    "_id": "genre_id",
    "name": "Action"
  },
  "numberInStock": 8,
  "dailyRentalRate": 3.0
}
```

**Error:** `404 Not Found` - Movie not found

---

### `DELETE /api/movies/:id`
**Delete a movie**

**Authentication:** Not required

**Parameters:**
- `id`: Movie MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "_id": "movie_id",
  "title": "The Matrix",
  "genre": {
    "_id": "genre_id",
    "name": "Action"
  },
  "numberInStock": 10,
  "dailyRentalRate": 2.5
}
```

**Error:** `404 Not Found` - Movie not found

---

## 📦 Rental Management Endpoints

### `GET /api/rentals`
**Get all rentals**

**Authentication:** Not required

**Response:** `200 OK`
```json
[
  {
    "_id": "rental_id",
    "customer": {
      "_id": "customer_id",
      "name": "John Doe",
      "phone": "1234567890"
    },
    "movie": {
      "_id": "movie_id",
      "title": "The Matrix",
      "dailyRentalRate": 2.5
    },
    "dateOut": "2024-01-15T10:00:00.000Z",
    "dateReturned": null,
    "rentalFee": null
  }
]
```

**Sorting:** Results sorted by `dateOut` (newest first, descending)

---

### `GET /api/rentals/:id`
**Get rental by ID**

**Authentication:** Not required

**Parameters:**
- `id`: Rental MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "_id": "rental_id",
  "customer": {
    "_id": "customer_id",
    "name": "John Doe",
    "phone": "1234567890"
  },
  "movie": {
    "_id": "movie_id",
    "title": "The Matrix",
    "dailyRentalRate": 2.5
  },
  "dateOut": "2024-01-15T10:00:00.000Z",
  "dateReturned": null,
  "rentalFee": null
}
```

**Error:** `404 Not Found` - Rental not found

---

### `POST /api/rentals`
**Create a new rental**

**Authentication:** Not required

**Request Body:**
```json
{
  "customerId": "customer_id_here",
  "movieId": "movie_id_here"
}
```

**Response:** `200 OK`
```json
{
  "_id": "rental_id",
  "customer": {
    "_id": "customer_id",
    "name": "John Doe",
    "phone": "1234567890"
  },
  "movie": {
    "_id": "movie_id",
    "title": "The Matrix",
    "dailyRentalRate": 2.5
  },
  "dateOut": "2024-01-15T10:00:00.000Z",
  "dateReturned": null,
  "rentalFee": null
}
```

**Validation:**
- customerId: Valid MongoDB ObjectId, required (validates customer exists)
- movieId: Valid MongoDB ObjectId, required (validates movie exists)

**Business Logic:**
- Validates customer exists
- Validates movie exists
- Checks movie stock availability (`numberInStock > 0`)
- Uses MongoDB transaction for atomicity:
  - Creates rental record
  - Decrements movie stock by 1
- If any step fails, transaction is rolled back

**Errors:**
- `400 Bad Request` - Invalid customer or movie
- `400 Bad Request` - Movie not in stock

**Auto-saves:** `rentalId` to collection variables

---

## 🔄 Return Management Endpoints

### `POST /api/returns`
**Process a rental return**

**Authentication:** Required (`x-auth-token` header)

**Request Body:**
```json
{
  "customerId": "customer_id_here",
  "movieId": "movie_id_here"
}
```

**Response:** `200 OK`
```json
{
  "_id": "rental_id",
  "customer": {
    "_id": "customer_id",
    "name": "John Doe",
    "phone": "1234567890"
  },
  "movie": {
    "_id": "movie_id",
    "title": "The Matrix",
    "dailyRentalRate": 2.5
  },
  "dateOut": "2024-01-15T10:00:00.000Z",
  "dateReturned": "2024-01-18T10:00:00.000Z",
  "rentalFee": 7.5
}
```

**Validation:**
- customerId: Valid MongoDB ObjectId, required
- movieId: Valid MongoDB ObjectId, required

**Business Logic:**
- Finds active rental matching customerId and movieId
- Validates rental exists and is not already returned
- Calculates rental fee: `(days rented) × dailyRentalRate`
- Sets `dateReturned` to current timestamp
- Increments movie stock by 1

**Errors:**
- `404 Not Found` - Rental not found
- `400 Bad Request` - Return already processed

**Note:** Cannot return a rental that has already been returned

---

## 📁 Project Structure

```
movie_rental/
├── config/                          # Configuration files
│   ├── custom-environment-variables.json
│   ├── default.json
│   └── test.json
├── middleware/                      # Express middleware
│   ├── admin.js                    # Admin role verification
│   ├── auth.js                    # JWT authentication
│   ├── error.js                    # Error handling middleware
│   ├── validate.js                 # Request validation middleware
│   └── validateObjectId.js        # MongoDB ObjectId validation
├── models/                         # Mongoose models
│   ├── customer.js
│   ├── genre.js
│   ├── movie.js
│   ├── rental.js
│   └── user.js
├── routes/                         # API route handlers
│   ├── auth.js                    # Authentication routes
│   ├── customers.js               # Customer CRUD routes
│   ├── genres.js                  # Genre CRUD routes
│   ├── movies.js                  # Movie CRUD routes
│   ├── rentals.js                # Rental management routes
│   ├── returns.js                 # Return processing routes
│   └── users.js                  # User management routes
├── startup/                        # Application initialization
│   ├── config.js                 # Configuration validation
│   ├── db.js                     # Database connection
│   ├── logging.js                # Winston logging setup
│   ├── prod.js                  # Production middleware (Helmet, Compression)
│   ├── routes.js                # Route registration
│   └── validation.js            # Joi validation setup
├── tests/                         # Test suites
│   ├── integration/              # Integration tests
│   │   ├── auth.test.js
│   │   ├── genres.test.js
│   │   └── returns.test.js
│   └── unit/                     # Unit tests
│       ├── middleware/
│       │   └── auth.test.js
│       └── models/
│           └── user.test.js
├── .env                          # Environment variables (not in repo)
├── .gitignore
├── index.js                      # Application entry point
├── package.json
├── sample.env                    # Environment variable template
├── test-api.js                   # Manual API testing script
└── README.md                     # This file
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password storage
- **Role-Based Access Control**: Admin and regular user roles
- **Token Validation**: Middleware validates JWT tokens on protected routes

### Input Validation
- **Joi Validation**: Comprehensive request body validation
- **ObjectId Validation**: MongoDB ObjectId format validation
- **Input Sanitization**: Prevents injection attacks

### Security Headers
- **Helmet.js**: Sets security HTTP headers
  - X-Content-Type-Options
  - X-Frame-Options
  - X-XSS-Protection
  - And more...

### Best Practices
- **Environment Variables**: Sensitive data stored in environment variables
- **No Sensitive Data in Responses**: Passwords excluded from API responses
- **Error Messages**: Generic error messages to prevent information leakage
- **Request Size Limits**: Express body parser limits

## ⚠️ Error Handling

### Error Response Format

All errors follow a consistent format:

**400 Bad Request** (Validation Errors)
```
Invalid email or password.
```

**401 Unauthorized** (Authentication Errors)
```
Access denied. No token provided.
```

**403 Forbidden** (Authorization Errors)
```
Access denied.
```

**404 Not Found** (Resource Not Found)
```
The customer with the given ID was not found.
```

**500 Internal Server Error** (Server Errors)
```
Something failed.
```

### Error Logging

- **Winston Logging**: All errors logged to `logfile.log`
- **Uncaught Exceptions**: Logged to `uncaughtExceptions.log`
- **Unhandled Rejections**: Converted to exceptions and logged

### Error Middleware

Centralized error handling middleware (`middleware/error.js`):
- Logs errors using Winston
- Returns generic error message to client
- Prevents stack trace exposure in production

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Test Structure

- **Unit Tests**: Test individual functions and middleware
- **Integration Tests**: Test complete API endpoints

### Test Coverage

Current test suites:
- Authentication middleware
- User model
- Auth endpoints
- Genre endpoints
- Return endpoints

### Manual Testing

Use the provided `test-api.js` script for manual API testing:

```bash
node test-api.js
```

**Note:** Ensure the server is running before executing tests.

## 📮 Postman Collection

A complete Postman collection is included: `Movie_Rental_API.postman_collection.json`

### Features

- **Auto-save Tokens**: Automatically saves JWT tokens from login/register
- **Auto-save IDs**: Automatically saves resource IDs (userId, genreId, customerId, movieId, rentalId)
- **Collection Variables**: Pre-configured variables for baseUrl and resource IDs
- **Request Examples**: Sample request bodies for all endpoints
- **Documentation**: Detailed descriptions for each endpoint

### Import Instructions

1. Open Postman
2. Click **Import** button
3. Select `Movie_Rental_API.postman_collection.json`
4. Collection will be imported with all endpoints organized by resource

### Usage Flow

1. **Register/Login**: Start with "Register User" or "Login" to get authentication token
2. **Create Resources**:
   - Create a Genre (required for movies)
   - Create a Movie (requires genreId)
   - Create a Customer
3. **Create Rental**: Use customerId and movieId
4. **Return Rental**: Process return with authentication token

### Collection Variables

The collection uses the following variables:
- `baseUrl`: API base URL (default: `http://localhost:3000`)
- `authToken`: JWT authentication token (auto-populated)
- `userId`: Current user ID (auto-populated)
- `genreId`: Genre ID (auto-populated after creation)
- `customerId`: Customer ID (auto-populated after creation)
- `movieId`: Movie ID (auto-populated after creation)
- `rentalId`: Rental ID (auto-populated after creation)

## 💻 Development

### Development Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test
```

### Code Style

- **ESLint**: Recommended for code linting
- **Prettier**: Recommended for code formatting
- **Async/Await**: Express 5 native async/await error handling (no wrapper needed)

### Adding New Features

1. **Create Model**: Add Mongoose schema in `models/`
2. **Create Validation**: Add Joi validation schema
3. **Create Routes**: Add route handlers in `routes/`
4. **Register Routes**: Add route registration in `startup/routes.js`
5. **Add Tests**: Create test files in `tests/`

### Database Transactions

The rental creation endpoint uses MongoDB transactions for data consistency:

```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // Create rental
  // Update movie stock
  await session.commitTransaction();
} catch (ex) {
  await session.abortTransaction();
} finally {
  session.endSession();
}
```

## 📝 API Workflow Example

### Complete Rental Flow

1. **Register User**
   ```bash
   POST /api/users
   # Returns: User object + x-auth-token header
   ```

2. **Create Genre**
   ```bash
   POST /api/genres
   Headers: x-auth-token: <token>
   Body: { "name": "Action" }
   # Returns: Genre with _id
   ```

3. **Create Movie**
   ```bash
   POST /api/movies
   Body: {
     "title": "The Matrix",
     "genreId": "<genre_id>",
     "numberInStock": 10,
     "dailyRentalRate": 2.5
   }
   # Returns: Movie with _id
   ```

4. **Create Customer**
   ```bash
   POST /api/customers
   Body: {
     "name": "John Doe",
     "phone": "1234567890",
     "isGold": false
   }
   # Returns: Customer with _id
   ```

5. **Create Rental**
   ```bash
   POST /api/rentals
   Body: {
     "customerId": "<customer_id>",
     "movieId": "<movie_id>"
   }
   # Returns: Rental object
   # Automatically decrements movie stock
   ```

6. **Return Rental**
   ```bash
   POST /api/returns
   Headers: x-auth-token: <token>
   Body: {
     "customerId": "<customer_id>",
     "movieId": "<movie_id>"
   }
   # Returns: Rental with dateReturned and rentalFee
   # Automatically increments movie stock
   ```

## 🚀 Production Deployment

### Environment Setup

1. Set production environment variables
2. Use strong JWT private key (32+ characters)
3. Configure MongoDB connection string
4. Enable production logging
5. Set up process manager (PM2, systemd, etc.)

### Recommended Practices

- Use MongoDB Atlas or managed MongoDB service
- Enable MongoDB authentication
- Use environment-specific configuration
- Set up monitoring and alerting
- Configure reverse proxy (Nginx)
- Enable HTTPS/SSL
- Set up backup strategy
- Configure rate limiting
- Enable request logging

## 📄 License

ISC License

## 👤 Author

Movie Rental API - Express.js 5 RESTful API

---

## 🎯 Quick Reference

### Authentication Required
- `POST /api/genres` - Create genre
- `PUT /api/genres/:id` - Update genre
- `DELETE /api/genres/:id` - Delete genre (Admin only)
- `GET /api/users/me` - Get current user
- `POST /api/returns` - Process return

### No Authentication Required
- `GET /api/genres` - List genres
- `GET /api/genres/:id` - Get genre
- `POST /api/users` - Register user
- `POST /api/auth` - Login
- All customer endpoints
- All movie endpoints
- All rental endpoints (except returns)

---

**Built with ❤️ using Express.js 5, MongoDB, and JWT Authentication**
