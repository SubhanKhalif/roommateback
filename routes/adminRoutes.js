import express from "express";
import { getAllUsers, deleteUser, makeAdmin } from "../controllers/adminController.js";

const router = express.Router();

// Admin route to get all users
router.get("/users", getAllUsers);

// Admin route to delete a user
router.delete("/users/:id", deleteUser);

// Admin route to promote a user to admin
router.put("/users/:id/make-admin", makeAdmin);

export default router;
