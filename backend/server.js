require("dotenv").config();
const express = require("express");
const app = express();
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const postRoutes = require("./routes/postRoutes");
const cors = require("cors");

const allowedOrigins = [
  "https://socialmedia-11.netlify.app", // ✅ your deployed frontend
  "http://localhost:5173" // ✅ for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
connectDb();
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
