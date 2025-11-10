import React, { useState } from "react";
import axios from "../api/axiosInstance";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function CommentBox({ postId, onCommentAdded }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setLoading(true);
      setError("");
      await axios.post(`/posts/${postId}/comment`, { text: comment });
      setComment("");
      // ✅ Notify parent to refresh comments
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{
            mb: 2,
            bgcolor: "white",
            borderRadius: 1,
          }}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1e40af" },
              textTransform: "none",
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Post"}
          </Button>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Box>
      </form>
    </Box>
  );
}
