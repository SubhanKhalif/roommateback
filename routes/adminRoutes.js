import express from "express";
import { getAllUsers, deleteUser, makeAdmin } from "../controllers/adminController.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

const router = express.Router();

// Admin route to get all users
router.get("/users", getAllUsers);

// Admin route to delete a user
router.delete("/users/:id", deleteUser);

// Admin route to promote a user to admin
router.put("/users/:id/make-admin", makeAdmin);

// Get total user count
router.get("/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get total post count
router.get("/posts/count", async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    res.status(200).json({ total: totalPosts });
  } catch (error) {
    console.error("Error counting posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;