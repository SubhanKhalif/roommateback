import express from "express";
import { protect } from "../config/authMiddleware.js";
import { createPost, getPosts, searchPosts, getUserPosts } from "../controllers/postController.js";
import { getAllPosts, updatePost, deletePost } from "../controllers/postController.js";

const router = express.Router();

// Fetch all posts
router.get("/", getAllPosts);

// Create a new post
router.post("/", createPost);

// Update a post
router.put("/:id", updatePost);

// Delete a post
router.delete("/:id", deletePost);

router.post("/create", protect, createPost);
router.get("/", getPosts);
router.get("/search", searchPosts); // Add search route
router.get("/user", protect, getUserPosts); // <-- Update route (use /user instead of /user/:userId)

export default router;
