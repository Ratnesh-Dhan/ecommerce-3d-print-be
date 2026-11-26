import express from "express";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

// All routes below require admin access
router.use(authenticate, requireAdmin);

// Admin Routes here ...

export default router;
