import express from "express";
import { uploadFineImage } from "../Controllers/fineReceipt.controller.js";
import upload from "../middleware/fileUpload.js"; // Import Multer config

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFineImage);

export default router;