const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/authUser");
const upload = require("../middlewares/upload");
const { createPost,getFeed,toggleLike,addComment,getComments } = require("../controllers/postController");


router.post("/create", authUser, upload.single("image"), createPost);
router.get("/feed", getFeed);
router.post("/:id/like", authUser, toggleLike);
router.post("/:id/comment", authUser, addComment);
router.get("/:id/comments", authUser, getComments);
module.exports = router;
