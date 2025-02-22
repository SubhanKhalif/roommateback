import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import Message from "./models/Message.js";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const clients = new Map(); // Stores connected users

// WebSocket connection handling
wss.on("connection", (ws, req) => {
  console.log("🔗 New WebSocket connection");

  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      const { senderId, receiverId, text } = parsedMessage;

      console.log(`📩 Message from ${senderId} to ${receiverId}: ${text}`);

      // Save the message in MongoDB
      const newMessage = new Message({ senderId, receiverId, text });
      await newMessage.save();

      // Send the message to the receiver if online
      if (clients.has(receiverId)) {
        clients.get(receiverId).send(JSON.stringify(parsedMessage));
      }
    } catch (error) {
      console.error("❌ Error processing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("🔴 WebSocket disconnected");
  });
});

console.log(`🌐 WebSocket server running on ws://localhost:${PORT}`);
