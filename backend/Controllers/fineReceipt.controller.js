import FineReceipt from '../models/FineReceipt.model.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (fileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export const uploadMiddleware = upload.single('file');

export const submitFineReceipt = async (req, res) => {
  try {
    const { vehicleNumber, licenseNumber, issueDate, section } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'File upload is required' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    const newReceipt = new FineReceipt({ vehicleNumber, licenseNumber, issueDate, section, fileUrl });
    await newReceipt.save();
    res.status(201).json({ message: 'Fine receipt uploaded successfully', receipt: newReceipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFineReceipts = async (req, res) => {
  try {
    const receipts = await FineReceipt.find();
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
