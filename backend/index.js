import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './DB/connectDB.js';

// Needed for ES module to use `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//User
import authRoutes from './Routes/auth.route.js';
import fineRoutes from "./Routes/fineReceipt.routes.js";


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
app.use("/api/fine", fineRoutes); // Fine-related routes
app.use("/fine-images", express.static(path.join(__dirname, "middleware", "ValidationFine_Images")));

//Admin Routes
app.use("/api/admin", adminRoutes);

// Start Server
app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server is running on port ${PORT}`);
});
