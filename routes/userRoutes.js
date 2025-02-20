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
  getProfileImage,
  upload
} from "../controllers/userController.js";

const router = express.Router();

// User creation route
router.post("/", createUser);

// Profile-related routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Profile image routes
router.put("/:id/profile-image", upload.single("image"), uploadProfileImage);
router.get("/:id/profile-image", getProfileImage);

// Password reset routes
router.post("/reset-password", sendResetEmail);
router.post("/verify-token", verifyOtp);
router.put("/update-password", updatePassword);

// Get user details by ID
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
