import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { protect } from "../config/authMiddleware.js";

const router = express.Router();

// Get users with whom the logged-in user has chatted
router.get("/chat-users", protect, async (req, res) => {
  try {
    const chats = await Message.find({
      $or: [
        { senderId: req.user._id },
        { receiverId: req.user._id }
      ]
    }).populate("senderId receiverId", "name profileImage");

    // Extract unique user IDs from messages
    const chatUsers = new Set();
    chats.forEach(message => {
      if (message.senderId._id.toString() !== req.user._id.toString()) {
        chatUsers.add(message.senderId);
      }
      if (message.receiverId._id.toString() !== req.user._id.toString()) {
        chatUsers.add(message.receiverId);
      }
    });

    res.json([...chatUsers]);
  } catch (error) {
    console.error("Error fetching chat users:", error);
    res.status(500).json({ message: "Server error fetching chat users" });
  }
});

// Send message
router.post("/send", protect, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const newMessage = new Message({ 
      senderId: req.user._id, 
      receiverId, 
      message 
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Could not send message" });
  }
});

// Get messages between two users
router.get("/:receiverId", protect, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId },
        { senderId: receiverId, receiverId: req.user._id },
      ],
    }).sort("createdAt");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch messages" });
  }
});

export default router;
