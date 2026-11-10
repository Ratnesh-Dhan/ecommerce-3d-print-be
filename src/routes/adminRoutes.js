const express = require("express");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// All routes below require admin access
router.use(authenticate, requireAdmin);

// Admin Routes here ...

module.exports = router;
