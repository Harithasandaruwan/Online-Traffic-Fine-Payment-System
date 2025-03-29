import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './DB/connectDB.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Needed for ES module to use `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//User
import authRoutes from './Routes/auth.route.js';
import fineRoutes from "./Routes/fineReceipt.routes.js";


//Admin
import adminRoutes from './Routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] [GLOBAL] ${req.method} ${req.originalUrl}`);
  next();
});

// // CORS configuration to allow requests from your frontend origins
// app.use(cors({
//   origin: "http://localhost:5176",  // Change to match your frontend
//   credentials: true, // Allow cookies & authentication headers
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

//User Routes mounting
app.use("/api/auth", authRoutes);
app.use("/api/fine", fineRoutes); // Fine-related routes
app.use("/fine-images", express.static(path.join(__dirname, "middleware", "ValidationFine_Images")));

//Admin Routes mounting
app.use("/api/admin", adminRoutes);

// Connect to MongoDB and start the server
connectDB().then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});
