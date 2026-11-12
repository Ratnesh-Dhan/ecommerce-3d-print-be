import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createNewUser, login, logout } from "../controllers/auth/login.js";

const router = express.Router();
// Auth Routes
router.post("/create-user", createNewUser);
router.post("/login", login);

// Authenticated Routes
router.use(authenticate);
router.post("/logout", logout);

export default router;
