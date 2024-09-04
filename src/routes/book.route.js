const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { bookValidations } = require("../validations/book.validations");
const validationChecker = require("../middleware/validationChecker");

const {
  createBook,
  getOwnBooks,
  deleteOwnBook,
  updateOwnBook,
  getBook,
  searchBooks,
  matchMakingBooks,
} = require("../controllers/book.controller");

router.post("/", auth, bookValidations, validationChecker, createBook);

router.get("/", auth, getOwnBooks);
router.get("/matchmaking", auth, matchMakingBooks);
router.get("/search", auth, searchBooks);
router.get("/:bookId", auth, getBook);

router.delete("/:id", auth, deleteOwnBook);
router.put("/:bookId", auth, updateOwnBook);

module.exports = router;
