import express from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import r2 from "../config/r2Client.js";
import { v4 as uuid } from "uuid";
import { addRow } from "../services/googleSheet.js";
import { generateQuoteId } from "../services/quoteId.js";

const router = express.Router();

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Upload route is working!",
  });
});

// Generate Upload URL
router.post("/presign", async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({
        success: false,
        message: "fileName and fileType are required",
      });
    }

    const key = `${uuid()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(r2, command, {
      expiresIn: 300,
    });

    res.json({
      success: true,
      uploadUrl,
      key,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/confirm", async (req, res) => {
  console.log("========== CONFIRM API HIT ==========");
  console.log(req.body);
  try {
    const quoteId = generateQuoteId();
    console.log("Generated Quote Id:", quoteId);

    console.log("Received Quote:");
    console.log(req.body);

    const now = new Date();

    const date = now.toLocaleDateString("en-GB");

    const time = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    await addRow({
      ...req.body,
      quoteId,
      date,
      time,
    });
    res.json({
      success: true,
      message: "Quote added to Google Sheet",
      quoteId,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
