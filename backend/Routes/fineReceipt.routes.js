import express from "express";
import { uploadFineImage, getAllFineDetails } from "../Controllers/fineReceipt.controller.js";
import upload from "../middleware/fileUpload.js"; // Import Multer config

const router = express.Router();

// POST endpoint for uploading a fine receipt
router.post("/upload", upload.single("file"), uploadFineImage);

// GET endpoint for fetching all fine details
router.get("/all", getAllFineDetails);

export default router;