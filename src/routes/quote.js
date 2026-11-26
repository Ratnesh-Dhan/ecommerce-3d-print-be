import express from "express";
import { saveQuote } from "../controllers/quote.js";

const router = express.Router();

router.post("/quote", saveQuote);

export default router;