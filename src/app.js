const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDb = require("./config/db.config");

connectDb();

const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).json({ message: `Server is up and running` });
});

app.get("/health", (req, res) => {
  return res.status(200).json({ message: `Server is up and running Health` });
});

app.use("/api/v1", routes);

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server Running on PORT: ${PORT}`);
});
