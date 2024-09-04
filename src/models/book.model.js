const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title name of book"],
      // unique: true,
    },
    author: {
      type: String,
      required: [true, "Please provide a author name of book"],
    },
    genre: {
      type: String,
      required: [true, "Please provide a genre for book"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isExchanged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

bookSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

bookSchema.pre("find", function () {
  if (!this.options.skipHook) {
    this.where({ isExchanged: false });
  }
});

bookSchema.pre("findOne", function () {
  if (!this.options.skipHook) {
    this.where({ isExchanged: false });
  }
});

// bookSchema.index({ userId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("Book", bookSchema);
