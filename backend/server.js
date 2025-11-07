require("dotenv").config();
const express = require("express");
const app = express();
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const postRoutes = require("./routes/postRoutes");

app.use(express.json());
app.use(cookieParser());
connectDb();
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
