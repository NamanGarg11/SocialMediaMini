import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function CommentsList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/posts/${postId}/comments`);
        setComments(res.data.comments);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  if (loading) return <CircularProgress size={24} />;
  if (!comments.length)
    return <Typography color="text.secondary">No comments yet.</Typography>;

  return (
    <Box sx={{ mt: 2 }}>
      {comments.map((c) => (
        <Box
          key={c._id}
          sx={{
            p: 1.5,
            mb: 1,
            borderRadius: 2,
            bgcolor: "#f3f4f6",
          }}
        >
          <Typography fontWeight={600}>@{c.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            {c.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
