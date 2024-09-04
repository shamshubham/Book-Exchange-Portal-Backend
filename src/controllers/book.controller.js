const Book = require("../models/book.model");
const Request = require("../models/request.model");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");

const createBook = async (req, res) => {
  try {
    const { user } = req;
    const { author, genre } = req.body;
    const title = req.body.title.trim();

    const query = {
      title: {
        $regex: new RegExp(`^${title}$`, "i"),
      },
      userId: user.id,
    };
    const bookAlreadyExists = await Book.findOne(query);

    if (bookAlreadyExists) {
      return res.status(401).json(errorResponse("Book already exists"));
    }

    const book = new Book({
      title,
      author,
      genre,
      userId: user.id,
    });

    await book.save();
    return res
      .status(201)
      .json(successResponse(book, "Book added successfully"));
  } catch (err) {
    console.error("Error in createBook: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

const getOwnBooks = async (req, res) => {
  try {
    const { user } = req;
    const books = await Book.find({ userId: user.id });

    return res
      .status(200)
      .json(successResponse(books, "Books fetched successfully"));
  } catch (err) {
    console.error("Error in getOwnBooks: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

const deleteOwnBook = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const book = await Book.findOne({ userId: user.id, _id: id });

    if (!book) {
      return res.status(404).json(errorResponse("Book not found"));
    }

    book.isDeleted = true;
    await book.save();

    return res
      .status(200)
      .json(successResponse(book, "Book deleted successfully"));
  } catch (err) {
    console.error("Error in deleteOwnBook: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

const updateOwnBook = async (req, res) => {
  try {
    const { user } = req;
    const { bookId } = req.params;
    const { title, author, genre } = req.body;

    const userOwnBooks = await Book.find({
      userId: user.id,
      _id: { $ne: bookId },
    });
    const userTitleBookExists = userOwnBooks.filter(
      (book) => book.title === title
    );

    if (userTitleBookExists.length !== 0) {
      return res
        .status(404)
        .json(errorResponse("Book already exists with same title name"));
    }

    const book = await Book.findOne({ userId: user.id, _id: bookId });

    if (!book) {
      return res.status(404).json(errorResponse("Error updating book"));
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;

    await book.save();

    return res
      .status(200)
      .json(successResponse(book, "Book updated successfully"));
  } catch (err) {
    console.error("Error in updateOwnBook: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

const getBook = async (req, res) => {
  try {
    const { user } = req;
    const { bookId } = req.params;

    const book = await Book.findOne({ userId: user.id, _id: bookId });

    return res
      .status(200)
      .json(successResponse(book, "Book fetched successfully"));
  } catch (err) {
    console.error("Error in getbook: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

const searchBooks = async (req, res) => {
  try {
    const { user } = req;
    const { title, genre, author } = req.query;

    const query = { userId: { $ne: user.id } };

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (genre) {
      query.genre = { $regex: genre, $options: "i" };
    }
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    const books = await Book.find(query);
    return res
      .status(200)
      .json(successResponse(books, "Books fetched applying filters"));
  } catch (err) {
    console.error("Error in searchBooks: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

const matchMakingBooks = async (req, res) => {
  try {
    const { user } = req;

    const ownBooks = await Book.find({ userId: user.id });
    const userGenres = [...new Set(ownBooks.map((book) => book.genre))]; //Fetching genre from ownBooks
    console.log("USER GENRES: ", userGenres);
    const userAuthors = [...new Set(ownBooks.map((book) => book.author))]; //Fetching author from ownBooks
    console.log("USER AUTHORS: ", userAuthors);

    const ownExchangeRequests = await Request.find({
      userId: user.id,
    }).populate({
      path: "bookId",
      match: { isExchanged: { $in: [true, false] } },
      options: { skipHook: true },
    });
    // console.log("My match making books: ", ownExchangeRequests);
    const userGenresFromRequests = [
      ...new Set(ownExchangeRequests.map((request) => request.bookId.genre)), // Need to check request.genre as i have to get this from request.receiverUserId.genre
    ];
    console.log("UserGenresFromRequests: ", userGenresFromRequests);
    const userAuthorsFromRequests = [
      ...new Set(ownExchangeRequests.map((request) => request.bookId.author)), // Need to check request.genre as i have to get this from request.receiverUserId.author
    ];
    console.log("UserAuthorsFromRequests", userAuthorsFromRequests);

    const query = {
      userId: { $ne: user.id },
      $or: [
        { genre: { $in: [...userGenres, ...userGenresFromRequests] } }, // Match books with genre from both arrays
        { author: { $in: [...userAuthors, ...userAuthorsFromRequests] } }, // Match books with author from both arrays
      ],
    };

    const books = await Book.find(query);
    console.log("Matchmaking Books: ", books);
    return res
      .status(200)
      .json(successResponse(books, "Matchmaking books successfully fetched"));
  } catch (err) {
    console.error("Error in matchMakingBooks: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

module.exports = {
  createBook,
  getOwnBooks,
  deleteOwnBook,
  updateOwnBook,
  getBook,
  searchBooks,
  matchMakingBooks,
};
