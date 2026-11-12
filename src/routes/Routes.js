import express from "express";
import { contact } from "../controllers/contact.js";
import { getDesigns } from "../controllers/shop.js";
import { home } from "../controllers/home.js";
import { wakeme } from "../controllers/wakeme.js";

const router = express.Router();

router.post("/contact", contact);
router.get("/shop", getDesigns);
router.get("/", home);
router.get("/wakeup", wakeme);

export default router;
