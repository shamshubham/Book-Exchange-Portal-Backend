const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");
const { secret, expiresIn } = require("../config/jwt.config");

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(errorResponse("User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    const userObj = user.toObject();
    delete userObj.password;

    return res
      .status(201)
      .json(successResponse(userObj, "User created successfully"));
  } catch (err) {
    console.error("Error in signup:", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json(
          errorResponse("User not found. Please check you email address !")
        );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json("Invalid credentials. Pleae your credentials !");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      secret,
      { expiresIn }
    );

    return res
      .status(200)
      .json(successResponse({ token }, "Login successfull"));
  } catch (err) {
    console.error("Error in login: ", err);
    return res.status(500).json(errorResponse(err.message));
  }
};

module.exports = { signUp, login };
