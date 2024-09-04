const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt.config");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; //Bearer token

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attaching decoded token data to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
