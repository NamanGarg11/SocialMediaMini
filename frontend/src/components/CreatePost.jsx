import React, { useState } from "react";
import axios from "../api/axiosInstance";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { deepOrange } from "@mui/material/colors";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) {
      alert("Write something or upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await axios.post("/posts/create", formData);
      setText("");
      setImage(null);
      setPreview(null);
      setSuccessMsg("Post created successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        mt: 12,
        mb: 5,
        boxShadow: 3,
        borderRadius: 3,
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: deepOrange[500] }}>
            U {/* you can replace this with user initial */}
          </Avatar>
        }
        title={
          <Typography variant="subtitle1" fontWeight={600}>
            Create a Post
          </Typography>
        }
      />

      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Post text */}
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />

          {/* Image upload & preview */}
          <Box sx={{ mb: 2 }}>
            <input
              accept="image/*"
              type="file"
              id="upload-image"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <label htmlFor="upload-image">
              <IconButton
                component="span"
                color="primary"
                sx={{ bgcolor: "#f3f4f6", borderRadius: 2 }}
              >
                <AddPhotoAlternateIcon />
              </IconButton>
              <Typography
                component="span"
                sx={{ ml: 1, color: "gray", fontSize: "0.9rem" }}
              >
                Add an image
              </Typography>
            </label>
          </Box>

          {/* Image Preview */}
          {preview && (
            <Box sx={{ mb: 2 }}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          {/* Actions */}
          <CardActions
            sx={{ display: "flex", justifyContent: "flex-end", px: 0 }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1e40af" },
                textTransform: "none",
                borderRadius: 2,
                px: 4,
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Post"}
            </Button>
          </CardActions>

          {/* Success Message */}
          {successMsg && (
            <Typography
              variant="body2"
              color="green"
              textAlign="center"
              sx={{ mt: 1 }}
            >
              {successMsg}
            </Typography>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
