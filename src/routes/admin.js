import { authenticate } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

router.get("/me", authenticate, (req, res) => {
  res.json({
    user: req.user,
  });
});

export default router;
