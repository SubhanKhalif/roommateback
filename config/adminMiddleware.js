import express from "express";
import { getAllUsers } from "../controllers/adminController.js";

const router = express.Router();

// सभी उपयोगकर्ताओं को प्राप्त करने के लिए रूट
// यहां कोई प्रमाणीकरण आवश्यक नहीं है
router.get("/users", getAllUsers);

export default router;
