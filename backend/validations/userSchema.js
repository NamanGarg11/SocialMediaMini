const { z } = require("zod");

module.exports.userSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" }),
    email: z
        .string()
        .email("Invalid email address"),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});

module.exports.userLoginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address"),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});
