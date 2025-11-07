const Post = require("../models/post");
const User = require("../models/user")
const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let image = "";

    if (req.file) {
      image = req.file.path; // Cloudinary returns a hosted URL here!
    }

    if (!text && !image) {
      return res.status(400).json({ message: "Post must have text or image" });
    }

    const post = new Post({
      user: req.user._id,
      text,
      image, // store the Cloudinary URL in MongoDB
    });

    await post.save();
    return res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const getFeed = async (req, res) => {
  try {
    // Extract query params
    const { lastId, limit = 5 } = req.query;

    // Build query condition
    const query = lastId ? { _id: { $lt: lastId } } : {};

    // Fetch posts sorted by latest first
    const posts = await Post.find(query)
      .populate("user", "username email")
      .sort({ _id: -1 }) // descending order, newest first
      .limit(parseInt(limit));

    // Transform for clean response
    const feed = posts.map((post) => ({
      _id: post._id,
      username: post.user?.username || "Unknown",
      text: post.text,
      image: post.image,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      createdAt: post.createdAt,
    }));

    // Determine next cursor (for frontend to fetch next batch)
    const nextCursor = posts.length > 0 ? posts[posts.length - 1]._id : null;

    res.status(200).json({
      nextCursor,
      hasMore: !!nextCursor,
      results: feed,
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ❤️ Like or Unlike a post
const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = req.user;

    const post = await Post.findById(postId).populate("user", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user already liked
    const alreadyLiked = post.likes.some((like) => like.userId.toString() === user._id.toString());

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter((like) => like.userId.toString() !== user._id.toString());
    } else {
      // Like
      post.likes.push({ userId: user._id, username: user.username });
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
      likes: post.likes.map((l) => l.username),
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 💬 Comment on a post
const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const user = req.user;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId).populate("user", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Add comment
    post.comments.push({
      userId: user._id,
      username: user.username,
      text,
    });

    await post.save();

    res.status(201).json({
      message: "Comment added successfully",
      commentsCount: post.comments.length,
      comments: post.comments.map((c) => ({
        username: c.username,
        text: c.text,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createPost,
  getFeed,
  toggleLike,
  addComment,
};

