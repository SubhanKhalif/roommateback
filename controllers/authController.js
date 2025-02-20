import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
      const { name, email, password, location } = req.body;
  
      if (!name || !email || !password || !location) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Store password as plaintext (INSECURE)
      const newUser = new User({ name, email, password, location });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  

  export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      res.status(200).json({ 
        token, 
        user: { id: user._id, name: user.name, email: user.email, location: user.location } 
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  