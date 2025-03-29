import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from "path";

import { connectDB } from './DB/connectDB.js';

//User
import authRoutes from './Routes/auth.route.js';
import FineReceipt from './Models/FineReceipt.model.js';

//Admin
import adminRoutes from './Routes/adminRoutes.js';

dotenv.config();

// Connect to Database first
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }))

app.use(express.json()); //allow us to parse incoming requests:req.body
app.use(cookieParser()); //allow us to parse incoming cookies
//User Routes
app.use("/api/auth", authRoutes);
//open
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './middleware/ValidationFine_Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
})

app.post("/upload",upload.single('file') , (req, res) => {
    FineReceipt.create({fileUrl: req.file.filename})
    .then(result => res.json(result))
    .catch(err => console.log(err))
});

//close

//Admin Routes
app.use("/api/admin", adminRoutes);

// Start Server
app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server is running on port ${PORT}`);
});
