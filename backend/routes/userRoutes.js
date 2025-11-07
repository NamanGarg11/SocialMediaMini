const express = require("express");
const router = express.Router();

console.log("✅ userRoutes loaded");

const userController = require("../controllers/userController");
const { userSchema, userLoginSchema } = require("../validations/userSchema");
const Validate = require("../middlewares/Validate");
const { authUser } = require("../middlewares/authUser");

router.post("/register", Validate(userSchema), userController.register);
router.post("/login", Validate(userLoginSchema), userController.loginUser);
router.get("/logout", authUser, userController.logoutUser);

module.exports = router;
