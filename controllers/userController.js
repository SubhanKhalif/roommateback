import User from "../models/User.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";

// Multer Storage (Stores file in memory)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;
    const user = new User({ name, email, password, location });

    await user.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields if provided
    const updateFields = {
      name: req.body.name || user.name,
      location: req.body.location || user.location,
      smoking: req.body.smoking || user.smoking,
      pets: req.body.pets || user.pets,
      cleanliness: req.body.cleanliness || user.cleanliness,
      workFromHome: req.body.workFromHome || user.workFromHome,
      budget: req.body.budget || user.budget,
      roommateGender: req.body.roommateGender || user.roommateGender,
      roommatesCount: req.body.roommatesCount || user.roommatesCount
    };

    // Update profile picture if provided
    if (req.body.profilePicture) {
      updateFields.profilePicture = req.body.profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload Profile Image
export const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profileImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await user.save();
    res.json({ message: "Profile image uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
};

// Get Profile Image
export const getProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.profileImage) return res.status(404).json({ message: "Image not found" });

    res.set("Content-Type", user.profileImage.contentType);
    res.send(user.profileImage.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching image", error: error.message });
  }
};

// Generate and send email with OTP
export const sendResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({ email, otp }, process.env.JWT_SECcret, { expiresIn: "10m" });

    // Store OTP in the database
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Create and verify email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email with OTP
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Code",
      text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
    });

    res.json({ message: "Verification email sent!", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Check if OTP is correct and not expired
  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  // OTP verified, clear it from the database
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({ message: "OTP verified successfully!" });
};

// Update password
export const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure OTP was verified before allowing password change
    if (user.otp) {
      return res.status(400).json({ message: "OTP verification required before resetting password." });
    }

    // Update the password directly (without hashing)
    user.password = newPassword;
    user.markModified("password");
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
