const express = require("express");
const router = express.Router();
const {
  signupValidations,
  loginValidations,
} = require("../validations/auth.validations");
const validationChecker = require("../middleware/validationChecker");

const { signUp, login } = require("../controllers/auth.controller");

router.post("/signup", signupValidations, validationChecker, signUp);
router.post("/login", loginValidations, validationChecker, login);

module.exports = router;
