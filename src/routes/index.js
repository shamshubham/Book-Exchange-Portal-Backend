const express = require("express");
const router = express.Router();

const authRoute = require("./auth.route");
const bookRoute = require("./book.route");
const requestRoute = require("./request.route");

router.use("/auth", authRoute);
router.use("/books", bookRoute);
router.use("/exchange", requestRoute);

module.exports = router;
