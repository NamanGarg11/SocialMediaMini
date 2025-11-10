import React, { useState } from "react";
import axios from "../api/axiosInstance";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { deepOrange } from "@mui/material/colors";
import CommentBox from "./CommentBox";
import CommentsList from "./CommentList";

export default function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);

  // ✅ Local reactive like state
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    try {
      // ✅ Optimistic update for instant UI feedback
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

      await axios.post(`/posts/${post._id}/like`);
    } catch (err) {
      console.error("Error liking post:", err);
      // rollback if API fails
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentAdded = () => {
    setRefreshComments((prev) => !prev);
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        mb: 4,
        boxShadow: 3,
        borderRadius: 3,
      }}
    >
      {/* Header */}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: deepOrange[500] }}>
            {post.username ? post.username[0].toUpperCase() : "U"}
          </Avatar>
        }
        title={
          <Typography variant="subtitle1" fontWeight={600}>
            @{post.username}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {new Date(post.createdAt).toLocaleString()}
          </Typography>
        }
      />

      {/* Image */}
      {post.image && (
        <CardMedia
          component="img"
          height="300"
          image={post.image}
          alt="Post"
          sx={{ objectFit: "cover" }}
        />
      )}

      {/* Text */}
      <CardContent>
        <Typography variant="body1" color="text.primary">
          {post.text}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions disableSpacing sx={{ px: 2, pb: 1 }}>
        {/* ❤️ Like Button */}
        <Tooltip title="Like">
          <IconButton
            onClick={handleLike}
            color={liked ? "error" : "default"}
            disabled={likeLoading}
          >
            <FavoriteIcon />
            <Typography sx={{ ml: 0.5 }}>{likesCount}</Typography>
          </IconButton>
        </Tooltip>

        {/* 💬 Comment Button */}
        <Tooltip title="Comment">
          <IconButton
            onClick={() => setShowComments(!showComments)}
            color="primary"
          >
            <ChatBubbleOutlineIcon />
            <Typography sx={{ ml: 0.5 }}>
              {post.commentsCount || 0}
            </Typography>
          </IconButton>
        </Tooltip>
      </CardActions>

      {/* 💬 Comment Section */}
      {showComments && (
        <>
          <CommentBox postId={post._id} onCommentAdded={handleCommentAdded} />
          <CommentsList key={refreshComments} postId={post._id} />
        </>
      )}
    </Card>
  );
}
