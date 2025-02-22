import express from "express";
import User from "../models/User.js";
import { protect } from "../config/authMiddleware.js";
import { 
  getUserProfile, 
  updateUserProfile,
  sendResetEmail,
  verifyOtp,
  updatePassword,
  createUser,
  uploadProfileImage,
  getProfileImage
} from "../controllers/userController.js";
import upload from "../config/uploadMiddleware.js";

const router = express.Router();

// ✅ Fetch all users (GET /api/users)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// ✅ Create new user
router.post("/", createUser);

// ✅ Get user profile (Protected)
router.get("/profile", protect, getUserProfile);

// ✅ Update user profile (Protected)
router.put("/profile", protect, updateUserProfile);

// ✅ Upload and get profile image
router.put("/:id/profile-image", upload.single("image"), uploadProfileImage);
router.get("/:id/profile-image", getProfileImage);

// ✅ Password reset functionality
router.post("/reset-password", sendResetEmail);
router.post("/verify-token", verifyOtp);
router.put("/update-password", updatePassword);

// ✅ Get user details by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
