const Request = require("../models/request.model");
const Book = require("../models/book.model");
const ObjectId = require("mongoose").Types.ObjectId;

const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");

const createRequest = async (req, res) => {
  try {
    const { user } = req;
    const { note, bookId } = req.body;

    const book = await Book.find({ _id: bookId });
    const bookOwnerId = book.userId;
    if (book.isExchanged === true) {
      return res.status(404).json(errorResponse("Book already exchanged"));
    }

    const existingRequest = await Request.findOne({
      userId: user.id,
      bookId: bookId,
    });

    if (existingRequest) {
      return res
        .status(400)
        .json(
          errorResponse(
            `Request already sent for this book and status is ${existingRequest.status}`
          )
        );
    }

    const request = new Request({
      note,
      userId: user.id,
      bookId,
    });

    await request.save();

    return res
      .status(201)
      .json(successResponse(request, "request created successfully"));
  } catch (err) {
    console.error("Error in createRequest: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

const getOwnRequests = async (req, res) => {
  try {
    const { user } = req;

    const requests = await Request.find({ userId: user.id }).populate({
      path: "bookId",
      match: { isExchanged: { $in: [true, false] } },
      options: { skipHook: true },
    });

    return res
      .status(200)
      .json(successResponse(requests, "Requests fetched successfully"));
  } catch (err) {
    console.error("Error in getOwnRequests: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

const deleteOwnRequest = async (req, res) => {
  try {
    const { user } = req;
    const { requestId } = req.params;

    const request = await Request.findOne({ userId: user.id, _id: requestId });

    if (!request) {
      return res.status(404).json(errorResponse("No request found"));
    }

    request.isDeleted = true;
    await request.save();

    return res
      .status(200)
      .json(successResponse(request, "Request deleted successfully"));
  } catch (err) {
    console.error("Error in deleteOwnRequest: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

const fullfilledRequest = async (req, res) => {
  try {
    const { user } = req;
    const { requestId } = req.params;
    const { status } = req.body;
    const request = await Request.findOne({ _id: requestId }).populate({
      path: "bookId",
      match: { isExchanged: { $in: [true, false] } },
      options: { skipHook: true },
    });

    console.log("Requests for fullfilled...", request);
    if (!request) {
      return res.status(404).json(errorResponse("No request found"));
    }
    console.log(request.status);
    if (request.status !== "pending") {
      return res.status(404).json(errorResponse("Request already processed"));
    }

    if (request.bookId.isExchanged === true) {
      return res.status(404).json(errorResponse("Book already exchanged."));
    }

    if (!request.bookId) {
      return res.status(404).json(errorResponse("No book found"));
    }

    const bookId = request.bookId;
    console.log(bookId);
    const book = await Book.findOne({ _id: bookId });
    console.log("Book:", book);

    request.status = status;
    await request.save();

    const bookUpdate = await Book.updateOne(
      { _id: request.bookId },
      { $set: { isExchanged: true } }
    );

    const requests = await Request.updateMany(
      { bookId: bookId, _id: { $ne: requestId } },
      { $set: { status: "cancelled" } }
    );

    return res
      .status(200)
      .json(successResponse(request, "Status changed successfully"));
  } catch (err) {
    console.error("Error in fullfilledRequest: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

const exchangeRequests = async (req, res) => {
  try {
    const { user } = req;

    // Ensure user.id is converted to ObjectId properly
    const userId = new ObjectId(user.id);

    const books = await Book.find({ userId: user.id });

    const requests = await Request.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $match: {
          "bookDetails.userId": userId,
          isDeleted: false,
        },
      },
    ]);
    console.log("My exchange Requests: ", requests);

    return res
      .status(200)
      .json(
        successResponse(requests, "Exchange Requests fetched successfully")
      );
  } catch (error) {
    console.error("Error in exchangeRequests: ", error);
    return res.status(500).json(errorResponse(error.message));
  }
};

module.exports = {
  createRequest,
  getOwnRequests,
  deleteOwnRequest,
  fullfilledRequest,
  exchangeRequests,
};
