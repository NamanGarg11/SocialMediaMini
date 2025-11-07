const userModel = require("../models/user");
const userService = require("../services/userService");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists
    const isUserExists = await userService.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const userInstance = new userModel();
    const hashPassword = await userInstance.hashPassword(password);

    const user = await userService.createUser({
      username,
      email,
      password: hashPassword,
    });

    const token = user.generateAuthToken();

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    const { password: _, ...safeUser } = user.toObject();
    res.status(200).json({ token, user: safeUser });

  } catch (error) {
    next(error); // Pass error to your error handling middleware
  }
};
const logoutUser = async (req, res) => {
  try {
    // Nothing to do server-side since JWT is stateless
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {
  register,
  loginUser,
  logoutUser,
};
