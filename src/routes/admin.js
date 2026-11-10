const { authenticate } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

router.get("/me", authenticate, (req, res) => {
  res.json({
    user: req.user,
  });
});

module.exports = router;
