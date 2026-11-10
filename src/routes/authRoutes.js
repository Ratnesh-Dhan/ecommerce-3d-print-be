const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const { createNewUser, login, logout } = require("../controllers/auth/login");
// Auth Routes
router.post("/create-user", createNewUser);
router.post("/login", login);

// Authenticated Routes
router.use(authenticate);
router.post("/logout", logout);

module.exports = router;
