module.exports = {
  secret: process.env.JWT_SECRET, // Stores in environment variable due to security
  expiresIn: "24h", // Token expiration time
};
