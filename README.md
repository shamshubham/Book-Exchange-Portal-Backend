# Book Exchange Portal - Backend

Welcome to the **Book Exchange Portal - Backend**! This project provides the server-side logic and API endpoints for the Book Exchange Portal, facilitating book exchanges and managing user interactions.

## 📦 Features

- **API Endpoints:** Comprehensive REST API for book management, user interactions, and exchange requests.
- **Database Integration:** Utilizes MongoDB for structured data storage and retrieval.
- **Authentication:** Secure user authentication and authorization.
- **Request Management:** Handle and track book exchange requests.

## 🛠 Technologies Used

- **Node.js:** JavaScript runtime for server-side development.
- **Express.js:** Web framework for building the API.
- **MongoDB:** Non-Relational database management system for data storage.
- **JWT (JSON Web Tokens):** For secure authentication and session management.
- **Express-Validator:** For validations of api.

## 🚀 Getting Started

To get the Book Exchange Portal backend up and running locally, follow these steps:

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org) (v14 or higher)
- [npm](https://www.npmjs.com) (v6 or higher)
- [MongoDB](https://www.mongodb.com/) for database management

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sham.shubham/Book-Exchange-Portal-Backend.git
   cd book-exchange-portal-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add your configuration details. For example:

   ```env
   DATABASE_URL="Mongo URI"
   JWT_SECRET="Your secret key"
   ```

4. **Set up the database:**

   Create the database schema and use into your MongoDB instance.

5. **Start the server:**

   ```bash
   npm start
   ```

   The API will be available at [http://localhost:3000](http://localhost:3000) by default.

## 📂 API Endpoints

- **`GET /api/v1/books`** - Retrieve a list of books.
- **`POST /api/v1/books`** - Add a new book.
- **`PUT /api/v1/books/:id`** - Update a book by ID.
- **`DELETE /api/v1/books/:id`** - Delete a book by ID.
- **`POST /api/v1/auth/signup`** - Register a new user.
- **`POST /api/v1/auth/login`** - Authenticate a user and get a JWT.
- **`POST /api/v1/requests`** - Create a new book exchange request.
- **`GET /api/v1/exchange`** - Get exchange requests for a specific user.
- **`POST /api/v1/exchange`** - Create request for book.

## 📂 Folder Structure

- **`src/`** - Contains all source code for the backend.
  - **`controllers/`** - Logic for handling API requests.
  - **`models/`** - Database models and schema definitions.
  - **`routes/`** - API route definitions.
  - **`config/`** - Configuration files (e.g., database, environment).
  - **`middleware/`** - Custom middleware (e.g., authentication).
  - **`services/`** - External services integration.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Make sure to follow the coding guidelines and include tests for new features.

## 📝 License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for more details.

## 📧 Contact

For questions or feedback, please contact [shubham.sv1906@gmail.com](mailto:shubham.sv1906@gmail.com).
