import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { WebSocketServer } from "ws";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3002;
const server = app.listen(PORT, () => console.log(`सर्वर पोर्ट ${PORT} पर चल रहा है`));

// WebSocket सर्वर इनिशियलाइज़ेशन
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("नया WebSocket कनेक्शन");

  ws.on("message", (message) => {
    console.log("प्राप्त:", message);
  });

  ws.on("close", () => {
    console.log("WebSocket बंद");
  });
});

console.log(`WebSocket सर्वर ws://localhost:${PORT} पर चल रहा है`);