const express = require("express");
const router = express.Router();
const { contact } = require("../controllers/contact");
const { getDesigns } = require("../controllers/shop");
const { home } = require("../controllers/home");
const { wakeme } = require("../controllers/wakeme");

router.post("/contact", contact);
router.get("/shop", getDesigns);
router.get("/", home);
router.get("/wakeup", wakeme);

module.exports = router;
