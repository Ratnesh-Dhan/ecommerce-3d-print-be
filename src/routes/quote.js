const express = require("express");
const router = express.Router();

const { saveQuote } = require("../controllers/quote");

router.post("/quote", saveQuote);

module.exports = router;