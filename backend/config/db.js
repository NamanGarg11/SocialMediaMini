const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Connected to MongoDB");
  } catch (error) {
    console.error(" Database connection failed:", error.message);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = connectDb;
