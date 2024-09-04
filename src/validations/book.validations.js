const { body } = require("express-validator");

const bookValidations = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Please provide a author name"),
  body("genre").notEmpty().withMessage("Please provide a genre of book"),
];

module.exports = { bookValidations };
