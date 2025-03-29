import express from 'express';
import { submitFineReceipt, getFineReceipts, upload } from '../Controllers/fineReceipt.controller.js';

const router = express.Router();

router.post('/upload', upload, submitFineReceipt);
router.get('/receipts', getFineReceipts);

export default router;