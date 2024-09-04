const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createRequest,
  getOwnRequests,
  deleteOwnRequest,
  fullfilledRequest,
  exchangeRequests,
} = require("../controllers/request.controller");

router.post("/", auth, createRequest);
router.get("/", auth, getOwnRequests);
router.get("/exchange-requests", auth, exchangeRequests);
router.delete("/:requestId", auth, deleteOwnRequest);
router.post("/:requestId", auth, fullfilledRequest);

module.exports = router;
